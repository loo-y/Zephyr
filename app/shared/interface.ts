export type AnyObj = Record<string, any>

export enum POEM_TYPE {
    tang = 'tang', // 唐诗
    song = 'song', // 宋词
    chuci = 'chuci', // 楚辞
    lunyu = 'lunyu', // 论语
    mengxue = 'mengxue', // 蒙学
    shijing = 'shijing', // 诗经
    wudai = 'wudai', // 五代诗词
    yuanqu = 'yuanqu', // 元曲
}
export interface IGetPoemsProps {
    author?: string
    tags?: string[]
    title?: string
    type?: POEM_TYPE
}
