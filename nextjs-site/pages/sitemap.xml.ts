import { GetServerSideProps } from "next";
import { fetchStrapi, LIMIT_BRANDS_PARAMS, LIMIT_MODELS_PARAMS } from "../functions/api";
import { Brand } from "../types/brand";
import { Model } from "../types/model";

const EXTERNAL_DATA_URL = 'http://perfect-garage.org';

function generateSiteMap(brands: Brand[], models: Model[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!--We manually set the two URLs we know already-->
      <url>
        <loc>${EXTERNAL_DATA_URL}/en</loc>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/fr</loc>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/fr/about</loc>
      </url>
      <url>
        <loc>${EXTERNAL_DATA_URL}/en/about</loc>
      </url>
      ${
        brands
          .map(({ id }) => 
            `
            <url>
                <loc>${`${EXTERNAL_DATA_URL}/fr/brands/${id}`}</loc>
            </url>
            <url>
                <loc>${`${EXTERNAL_DATA_URL}/en/brands/${id}`}</loc>
            </url>
            `
          )
          .join('')
      }
      ${
        models
          .map(({ id }) => 
            `
            <url>
                <loc>${`${EXTERNAL_DATA_URL}/fr/models/${id}`}</loc>
            </url>
            <url>
                <loc>${`${EXTERNAL_DATA_URL}/en/models/${id}`}</loc>
            </url>
            `
          )
          .join('')
      }
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const brands = await fetchStrapi<Array<Model>>(`brands?${LIMIT_BRANDS_PARAMS}`);
  const models = await fetchStrapi<Array<Model>>(`models?${LIMIT_MODELS_PARAMS}`);

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(brands?.data ?? [], models?.data ?? []);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
