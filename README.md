# Unsplash website scraper

**Requirements**

```
nodejs v18
```

**Setup**

Install required packages

```bash
npm install
```

Convert typescipt into javascript

```bash
npm run build
```

Run the app

```bash
npm run start
```

**API Usage**

```
GET http://localhost:3000/?query=&p=3&limit=
```

`query`: The search query

`p`: page number

`limit`: results per page

**Example**

```
GET http://localhost:3000/?query=car&p=3&limit=2
```

Response:

```json
{
  "total": 10103,
  "total_pages": 5052,
  "results": [
    {
      "description": "Black sports car front",
      "urls": {
        "full": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3&q=85",
        "raw": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3",
        "regular": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3&q=80&w=1080",
        "small": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3&q=80&w=400",
        "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1494976388531-d1058494cdd8",
        "thumb": "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3&q=80&w=200"
      }
    },
    {
      "description": "Audi A5",
      "urls": {
        "full": "https://images.unsplash.com/photo-1542282088-fe8426682b8f?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3&q=85",
        "raw": "https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3",
        "regular": "https://images.unsplash.com/photo-1542282088-fe8426682b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3&q=80&w=1080",
        "small": "https://images.unsplash.com/photo-1542282088-fe8426682b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3&q=80&w=400",
        "small_s3": "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1542282088-fe8426682b8f",
        "thumb": "https://images.unsplash.com/photo-1542282088-fe8426682b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y2FyfGVufDB8fHx8MTY4NzExMjc2OXww&ixlib=rb-4.0.3&q=80&w=200"
      }
    }
  ]
}
```

`total`: total results

`total_pages`: total pages per x limit
