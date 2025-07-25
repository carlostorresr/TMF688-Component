# TMF688-Component

Este repositorio contiene la implementación de un componente ODA basado en la especificación **TMF688 - Event Management API** del TM Forum.

## 🧩 Descripción

El componente TMF688 permite la gestión de eventos, tópicos y suscripciones (`hub`) dentro del ecosistema ODA Canvas. Está diseñado para integrarse con otros componentes TMF y utiliza Kafka como bus de eventos.

## 🚀 Tecnologías utilizadas

- Node.js 18+
- Express.js
- Kafka + Strimzi + Kafka Bridge
- Swagger UI
- Helm Charts para Kubernetes
- Docker
- Kubernetes

## 📁 Estructura del proyecto

```
TMF688-Component/
├── charts/                    # Helm chart para el despliegue
├── src/                       # Código fuente backend en Node.js
├── openapi/                   # Open API TMF688 (Swagger)
├── oda.component.yaml         # Definición del componente ODA
├── Dockerfile
└── README.md
```

## ⚙️ Despliegue

### Despliegue local (modo desarrollo)

```bash
npm install
npm start
```

Por defecto, la API se expone en: `http://localhost:3000/tmf-api/eventManagement/v4`

### Despliegue en Kubernetes con Helm

```bash
helm install tmf688 ./charts/tmf688 -n components
```

Asegúrate de tener configurado tu `values.yaml` con la URL del Kafka Bridge y MongoDB si aplica.

## 📌 Endpoints principales

| Recurso | Método | Descripción |
|---------|--------|-------------|
| `/event` | POST / GET | Publicación y consulta de eventos |
| `/topic` | GET         | Listado de tópicos disponibles |
| `/hub`   | POST / DELETE | Suscripción a eventos y eliminación de subscripciones |

## 📬 Autor

**Carlos Torres**  
Arquitecto de Integración  
GitHub: [@carlostorresr](https://github.com/carlostorresr)

> Proyecto basado en el repositorio oficial [tmforum-oda/oda-canvas](https://github.com/tmforum-oda/oda-canvas) con personalizaciones propias.
