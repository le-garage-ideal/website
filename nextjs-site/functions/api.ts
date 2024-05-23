type MetaType = {
  pagination: {
      page: number,
      pageSize: number,
      pageCount: number,
      total: number,
  },
};
export type StrapiResponseType<T> = { data: T, meta: MetaType };
export const fetchStrapi = async <T> (path: string, body?: any): Promise<StrapiResponseType<T>> => {
  const url = `${process.env.STRAPI_BASE_API_URL}/${path}`;
  try {
    const res = await fetch(
      url,
      {
        method: 'GET',
        headers: {Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
        body,
      },
    });
    const { data, meta } = await res.json()
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
  } catch (err: any) {
    if (err.isAxiosError) {
      throw new Error(`Error ${url} ${process.env.STRAPI_TOKEN}`, err?.response?.data?.error?.message);
    } else {
      throw new Error(`Error ${url} ${process.env.STRAPI_TOKEN}`, err);
    }
  }
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
export const LIMIT_BRANDS_PARAMS = 'pagination[limit]=200';
export const LIMIT_MODELS_PARAMS = 'pagination[limit]=1000';
export const LIMIT_CARS_PARAMS = 'pagination[limit]=500';
export const LIMIT_MODELS_PER_BRAND_PARAMS = 'pagination[limit]=200';
export const LIMIT_CARS_PER_MODEL_PARAMS = 'pagination[limit]=200';
