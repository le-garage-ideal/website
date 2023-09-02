type MetaType = {
  pagination: {
      page: number,
      pageSize: number,
      pageCount: number,
      total: number,
  },
};
export type StrapiResponseType<T> = { data: T, meta: MetaType };
export const fetchStrapi = <T> (path: string, body?: any): Promise<void | StrapiResponseType<T>> => {
  const url = `${process.env.STRAPI_BASE_API_URL}/${path}`;
  return fetch(
    url,
    {
      method: 'GET',
      headers: {Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      body,
    },
  })
  .then((res) => res.json())
  .then(({ data, meta }) => {
    if (Array.isArray(data)) {
      return {
        data: data.map(formatStrapiObjects),
        meta,
      } as any as StrapiResponseType<T>;
    } else {
      return {
        data: formatStrapiObjects(data),
        meta,
      } as any as StrapiResponseType<T>;
    }
  })
  .catch((err) => {
    if (err.isAxiosError) {
      console.error(`Error ${url} ${process.env.STRAPI_TOKEN}`, err?.response?.data?.error?.message);
    } else {
      console.error(`Error ${url} ${process.env.STRAPI_TOKEN}`, err);
    }
  });
}

export const formatStrapiObjects = <T> (strapiObject: any): T => {
  let res = {...strapiObject};
  if (res.attributes) {
    const attributesCopy = res.attributes;
    delete res.attributes;
    res = {...res, ...attributesCopy};
  }
  if (res.data) {
    const dataCopy = res.data;
    delete res.data;
    res = {...res, ...dataCopy};
  }
  if (res.attributes || res.data) {
    res = formatStrapiObjects(res);
  } else {
    Object.keys(res).forEach((key) => {
      if (res[key]?.attributes || res[key]?.data) {
        res[key] = formatStrapiObjects(res[key])
      }
    });
  }
  return res;
};

export const POPULATE_CARS_PARAMS = 'populate=deep';
