import { Car } from "../types/car";

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


export async function fetchPrice(car: Car | undefined): Promise<{ price: number; barPriceStyle: any }> {
  const PRICE_MAX = 500000; // max 500k€ else overflow
  let price;
  if (car) {
    const model = `${car?.model.brand} ${car.variant}${` year ${car.startYear}` ?? ""}`;
    //const storedPrice = localStorage.getItem(model);
    let storedPrice = null;
    if (storedPrice) {
      console.log('price from storage');
      price = parseFloat(storedPrice);
    } else {
      console.log('fetching price');
      const response = await fetch(process.env.NEXT_PUBLIC_AI_BASE_API_URL as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model }),
      });
      const data = await response.json();
      //localStorage.setItem(model, data.price);
      price = data.price;  
    }
  }
  const barPriceStyle = price ? {
    width: `${(price * 100) / PRICE_MAX}%`,
  } : undefined;
  return { price, barPriceStyle };
}

export const POPULATE_CARS_PARAMS = 'populate=deep';
export const LIMIT_BRANDS_PARAMS = 'pagination[limit]=200';
export const LIMIT_MODELS_PARAMS = 'pagination[limit]=1000';
export const LIMIT_CARS_PARAMS = 'pagination[limit]=500';
export const LIMIT_MODELS_PER_BRAND_PARAMS = 'pagination[limit]=200';
export const LIMIT_CARS_PER_MODEL_PARAMS = 'pagination[limit]=200';
