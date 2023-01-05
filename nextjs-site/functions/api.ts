export const fetchStrapi = (method: string, path: string, body?: any) => fetch(
  `${process.env.STRAPI_BASE_API_URL}/${path}`,
  {
    method,
    headers: {Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
    body,
  },
})
.then((res) => res.json())
.then(({ data }) => data)
.catch((err) => {
  if (err.isAxiosError) {
    console.error(err?.response?.data?.error?.message);
  } else {
    console.error(`Error`, err);
  }
});
