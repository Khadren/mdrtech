---
title: "Redesigning an AWS Transfer AS2 Architecture"
slug: aws-transfer-as2-architecture
summary: "Documenting a redesign of a serverless AS2 file transfer system using AWS Transfer, S3, Lambda, and enterprise storage integration."
status: published
---

### Overview

Originally I was working through the architecture for replacing a legacy managed file transfer platform with a cloud-native design using AWS Transfer for AS2 at Dentsu.

The goal was to simplify partner file exchange while maintaining strong security and auditability.

My current goal is to plan out that same infrastructure, re-calculate costs, document everything and if costs aren't too crazy commit to a short test.

### Basic Axway Architecture

#### OUTBOUND

```
User
 │
 ▼
Nasuni Share
 │
 ▼
Axway (Azure VM)
 │
 ▼
AS2 Transfer
 │
 ▼
Trading Partner
```

#### INBOUND

```
Trading Partner
 │
 ▼
AS2 Transfer
 │
 ▼
Axway (Azure VM)
 │
 ▼
Decrypt / Verify
 │
 ▼
Nasuni Share
 │
 ▼
User / Application
```

### Azure Architecture (Best guess from memory)

1. Ingress
   - Public IP Address
   - Public Load Balancer

2. Network & Security
   - VNet (Would remain/Not factored into costs)
   - Subnet (Would remain/Not factored into costs)
   - NSG (I believe there was one attached to the VM)
   - Azure Firewall / NVA (Uncertain of this area, but would remain/Not factored into costs)

3. Compute
   - VM
   - Managed Disks

4. Egress
   - Nasuni, could be accessed on-prem or in cloud, either way not factored into costs

### Architecture Goals

- Replace legacy Axway platform (See above)
- Maintain secure partner file exchange
- Maintain integration with enterprise storage
- Provide monitoring and alerting

### Planned Architecture

#### INBOUND

```
Trading Partner
 │
 ▼
AWS Transfer (AS2)
 │
 ▼
S3 landing bucket
 │
 ▼
Lambda or Datasync
 │
 ▼
Nasuni Share
 │
 ▼
User / Application
```

#### OUTBOUND

```
User
 │
 ▼
Nasuni Share
 │
 ▼
Lambda or Datasync
 │
 ▼
S3 landing bucket
 │
 ▼
AWS Transfer (AS2)
 │
 ▼
Trading Partner
```

Outbound and inbound file flows are separated to simplify routing and error handling.

### Key Design Considerations

- Certificate and key management
- File routing logic
- Error handling and retries
- Monitoring and alerting with CloudWatch
- Integration with enterprise storage platforms

### Status

Currently documenting the architecture and building a proof-of-concept environment.

A detailed write-up of the design and implementation will be added once the project is complete.
