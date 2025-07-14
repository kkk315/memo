declare module 'gray-matter' {
  interface GrayMatterFile<T = any> {
    data: T;
    content: string;
    excerpt?: string;
    orig: Buffer | string;
    language: string;
    matter: string;
    stringify(lang?: string): string;
  }

  interface GrayMatterOption<T = any> {
    parser?: any;
    eval?: boolean;
    excerpt?: boolean | ((file: GrayMatterFile<T>, options: GrayMatterOption<T>) => string);
    excerpt_separator?: string;
    engines?: { [index: string]: any };
    language?: string;
    delimiters?: string | [string, string];
  }

  function matter<T = any>(input: string | Buffer, options?: GrayMatterOption<T>): GrayMatterFile<T>;

  export = matter;
}
