export interface IVisorTab {
    id : string,
    title: string,
    widget?: any,
    toasterMessage?: string,
    openableSidebarNeeded: boolean,
    largeSidebarNeeded: boolean,
    icon: string,
    iconStyle: string,
}