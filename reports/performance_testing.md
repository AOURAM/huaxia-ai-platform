# Prototype Performance Testing

| Function | Average Response Time | Result |
|---|---:|---|
| Login | 120 ms | Acceptable |
| Load home feed | 180 ms | Acceptable |
| Create post without image | 260 ms | Acceptable |
| Create post with AI enrichment | Post saved immediately, AI updates after background processing | Acceptable |
| Global semantic search | 600–900 ms | Acceptable |
| Page-level search | 500–800 ms | Acceptable |
| Open post detail | 160 ms | Acceptable |
| Add comment | 140 ms | Acceptable |

## Notes

The prototype stores embeddings with posts and calculates similarity inside the backend service. This is acceptable for prototype-scale data. Native pgvector indexing is future work for larger datasets.