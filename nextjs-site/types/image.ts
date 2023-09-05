export type Image = {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  ext: string;
  mime: string;
  size: number;
  url: string;
  formats: {
    small: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: string;
        size: number;
        width: number;
        height: number;
    };
    thumbnail: {
        ext: string;
        url: string;
        hash: string;
        mime: string;
        name: string;
        path: string;
        size: number;
        width: number;
        height: number;
    }
  };
};
