## Steps to reproduce the issue

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

- click on Tenant 1 you will see texts from: `public/locales/ar/tenant1.json`
- then from the bottom of the page click on: back to tenant 2 
- texts should be loaded from:  `public/locales/ar/tenant2.json` but still the texts for Tenant 1
- reload the page 2/4 times you will see the texts correct for Tenant 2
- try to edit any key in: `public/locales/ar/tenant1.json` then reload the page when you are in [http://localhost:3000/tenant-2](http://localhost:3000/tenant-2)
- texts will still correct for Tenant 2, but try to go to tenant 1 the texts will still loaded for Tenant 2, reload the page 2/4 times correct texts will show up
