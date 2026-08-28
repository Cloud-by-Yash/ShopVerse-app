# HTTPS Setup with cert-manager & Let's Encrypt on EKS

This guide sets up free, auto-renewing SSL/TLS certificates for ShopVerse using cert-manager and Let's Encrypt with Traefik ingress controller.

## Prerequisites

- EKS cluster running with Traefik ingress controller installed
- Domain name pointing to the Traefik NLB (via Route53 / GoDaddy)
- Application accessible over HTTP

## Step 1: Install cert-manager

```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true
```

Verify all 3 pods are running:

```bash
kubectl get pods -n cert-manager
```

Expected output:

```
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-xxxxxxxxxx-xxxxx              1/1     Running   0          1m
cert-manager-cainjector-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
cert-manager-webhook-xxxxxxxxxx-xxxxx      1/1     Running   0          1m
```

## Step 2: Create ClusterIssuer

```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: vijaygiduthuri@gmail.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
      - http01:
          ingress:
            ingressClassName: traefik
EOF
```

Verify:

```bash
kubectl get clusterissuer
```

`READY` should show `True`.

## Step 3: Create Certificate

```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: shopverse-tls
  namespace: shopverse
spec:
  secretName: shopverse-tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - vijaygiduthuri.in
EOF
```

Check certificate status:

```bash
kubectl get certificate -n shopverse
```

Wait until `READY` shows `True`. If it takes more than 2 minutes, debug with:

```bash
kubectl describe certificate shopverse-tls -n shopverse
kubectl get certificaterequest -n shopverse
kubectl get order -n shopverse
kubectl get challenge -n shopverse
```

## Step 4: Create HTTPS IngressRoute

```bash
kubectl apply -f - <<EOF
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: shopverse-websecure
  namespace: shopverse
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(\`vijaygiduthuri.in\`) && PathPrefix(\`/api\`)
      kind: Rule
      services:
        - name: shopverse-backend-svc
          port: 8080
    - match: Host(\`vijaygiduthuri.in\`) && PathPrefix(\`/health\`)
      kind: Rule
      services:
        - name: shopverse-backend-svc
          port: 8080
    - match: Host(\`vijaygiduthuri.in\`)
      kind: Rule
      services:
        - name: shopverse-frontend-svc
          port: 80
  tls:
    secretName: shopverse-tls-secret
EOF
```

## Step 5: HTTP to HTTPS Redirect

This redirects all HTTP (port 80) traffic to HTTPS (port 443) automatically.

```bash
kubectl apply -f - <<EOF
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: redirect-https
  namespace: shopverse
spec:
  redirectScheme:
    scheme: https
    permanent: true
---
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: shopverse-web-redirect
  namespace: shopverse
spec:
  entryPoints:
    - web
  routes:
    - match: Host(\`vijaygiduthuri.in\`)
      kind: Rule
      middlewares:
        - name: redirect-https
      services:
        - name: shopverse-frontend-svc
          port: 80
EOF
```

## Verification

Test HTTPS is working:

```bash
# Check certificate in browser
https://vijaygiduthuri.in

# Check from command line
curl -I https://vijaygiduthuri.in

# Verify HTTP redirects to HTTPS
curl -I http://vijaygiduthuri.in
# Should return 301 with Location: https://vijaygiduthuri.in
```

## Certificate Renewal

cert-manager automatically renews the certificate **30 days before expiry**. Let's Encrypt certificates are valid for 90 days, so renewal happens every ~60 days with zero manual intervention.

Check renewal status anytime:

```bash
kubectl get certificate -n shopverse
```

## Troubleshooting

**Certificate stuck on `False`:**

```bash
kubectl describe challenge -n shopverse
```

Common issues:
- Domain not pointing to the NLB — verify DNS with `nslookup vijaygiduthuri.in`
- Port 80 not open — cert-manager needs HTTP-01 challenge on port 80
- Traefik not routing `.well-known/acme-challenge` — make sure the HTTP IngressRoute for the domain exists

**Delete and retry certificate:**

```bash
kubectl delete certificate shopverse-tls -n shopverse
kubectl delete secret shopverse-tls-secret -n shopverse
# Then re-apply Step 3
```

## Cleanup

To remove the HTTPS setup:

```bash
kubectl delete ingressroute shopverse-websecure -n shopverse
kubectl delete ingressroute shopverse-web-redirect -n shopverse
kubectl delete middleware redirect-https -n shopverse
kubectl delete certificate shopverse-tls -n shopverse
kubectl delete secret shopverse-tls-secret -n shopverse
kubectl delete clusterissuer letsencrypt-prod
helm uninstall cert-manager -n cert-manager
kubectl delete namespace cert-manager
```
