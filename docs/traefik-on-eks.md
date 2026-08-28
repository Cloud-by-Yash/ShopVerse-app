# Traefik Ingress Controller on AWS EKS

## Overview

This guide sets up Traefik as the ingress controller for ShopVerse on AWS EKS.
Traefik creates an AWS NLB (Network Load Balancer) in the public subnet,
routing external traffic into the frontend and backend pods running on private nodes.

```
Internet
    |
    v
AWS NLB (public subnet)  <-- Traefik creates this automatically
    |
    v
Traefik pod (private node, namespace: traefik)
    |              |
    v              v
Frontend        Backend
 pod             pod
(namespace: shopverse)
```

---

## Prerequisites

- `kubectl` connected to your EKS cluster
- `helm` v3 installed locally
- AWS CLI configured

---

## Step 1: Connect to EKS Cluster

```bash
aws eks update-kubeconfig --name shopverse-cluster --region us-east-1
```

Verify:
```bash
kubectl get nodes -o wide
```

---

## Step 2: Install Traefik via Helm

### Add Traefik Helm repo

```bash
helm repo add traefik https://traefik.github.io/charts
helm repo update
```

### Create Traefik namespace

```bash
kubectl create namespace traefik
```

### Create `traefik-values.yaml`

> **Why a values file?** Using `--set` for annotation values causes Helm to misinterpret
> boolean-like strings (e.g. `"true"`) as Go booleans, which breaks manifest generation.
> Always use a values file for annotations.

> **Why ports 8000/8443?** Traefik runs as non-root and cannot bind to privileged ports
> (< 1024). Use internal ports `8000`/`8443` and expose them as `80`/`443` via the NLB.

```yaml
service:
  type: LoadBalancer
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-scheme: "internet-facing"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"

ports:
  web:
    port: 8000
    exposedPort: 80
  websecure:
    port: 8443
    exposedPort: 443

logs:
  general:
    level: INFO
```

### Install Traefik

```bash
helm upgrade --install traefik traefik/traefik \
  --namespace traefik \
  -f traefik-values.yaml
```

### Verify Traefik is running

```bash
kubectl get pods -n traefik
kubectl get svc -n traefik
```

Expected output:
```
NAME      TYPE           CLUSTER-IP     EXTERNAL-IP                          PORT(S)
traefik   LoadBalancer   172.20.x.x     xxxx.elb.us-east-1.amazonaws.com     80:xxxxx/TCP,443:xxxxx/TCP
```

The `EXTERNAL-IP` is your public NLB DNS name. It takes 2-3 minutes to provision.

---

## Step 3: Get the Public NLB DNS Name

```bash
kubectl get svc traefik -n traefik -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

---

## Step 4: Create IngressRoutes for Frontend and Backend

Apply the manifest directly with `kubectl`:

```bash
kubectl apply -f - <<'EOF'
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: shopverse-backend
  namespace: shopverse
spec:
  entryPoints:
    - web
  routes:
    - match: PathPrefix(`/api`) || PathPrefix(`/health`)
      kind: Rule
      services:
        - name: shopverse-backend-svc
          port: 8080
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: shopverse-frontend
  namespace: shopverse
spec:
  entryPoints:
    - web
  routes:
    - match: PathPrefix(`/`)
      kind: Rule
      services:
        - name: shopverse-frontend-svc
          port: 80
EOF
```

Verify:
```bash
kubectl get ingressroute -n shopverse
```

---

## Step 5: Access the Application

```bash
NLB=$(kubectl get svc traefik -n traefik -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Frontend:    http://$NLB"
echo "Backend API: http://$NLB/api"
echo "Health:      http://$NLB/health"
```

---

## Step 6: Access Traefik Dashboard (Optional)

The Traefik dashboard shows all routes, services, and health status.

```bash
kubectl port-forward -n traefik $(kubectl get pods -n traefik -o name | head -1) 9000:9000
```

Open: `http://localhost:9000/dashboard/`

---

## Troubleshooting

### NLB stuck in `<pending>` state
```bash
kubectl describe svc traefik -n traefik
```
Common causes:
- Public subnets not tagged with `kubernetes.io/role/elb=1`
- IAM role missing `elasticloadbalancing:*` permissions

Tag public subnets:
```bash
aws ec2 create-tags \
  --resources subnet-xxxxxxxx subnet-yyyyyyyy \
  --tags Key=kubernetes.io/role/elb,Value=1
```

### Traefik pod in CrashLoopBackOff — `permission denied` on port 80
Caused by setting `ports.web.port: 80`. Non-root containers cannot bind to ports < 1024.
Fix: use `port: 8000` with `exposedPort: 80` in the values file (as shown above).

### Traefik pod in CrashLoopBackOff — annotation marshal error
Caused by using `--set` for boolean annotation values. Helm coerces `true` to a Go bool,
breaking the manifest. Fix: use a values file (`-f traefik-values.yaml`) instead.

### IngressRoute not recognized (`no matches for kind "IngressRoute"`)
Install the Traefik CRDs manually:
```bash
kubectl apply -f https://raw.githubusercontent.com/traefik/traefik/v3.0/docs/content/reference/dynamic-configuration/kubernetes-crd-definition-v1.yml
```
Then re-apply the IngressRoute manifest.

### 404 on frontend or backend routes
```bash
# Check IngressRoutes exist
kubectl get ingressroute -n shopverse

# Check services and endpoints
kubectl get svc -n shopverse
kubectl get endpoints -n shopverse
```

---

## Quick Reference

```bash
# Check all shopverse pods
kubectl get pods -n shopverse

# Check Traefik pod
kubectl get pods -n traefik

# Get public NLB URL
kubectl get svc traefik -n traefik

# View Traefik logs
kubectl logs -n traefik -l app.kubernetes.io/name=traefik --tail=50

# Restart Traefik
kubectl rollout restart deployment/traefik -n traefik

# Reinstall Traefik
helm uninstall traefik -n traefik
helm upgrade --install traefik traefik/traefik --namespace traefik -f traefik-values.yaml
```
