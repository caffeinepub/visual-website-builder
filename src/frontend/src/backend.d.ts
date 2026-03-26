import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Project {
    id: string;
    ownerId: Principal;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface Page {
    id: string;
    order: bigint;
    name: string;
    projectId: string;
}
export interface UserProfile {
    name: string;
}
export interface Element {
    id: string;
    order: bigint;
    pageId: string;
    elementType: string;
    propsJson: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createElement(pageId: string, elementType: string, propsJson: string, order: bigint): Promise<Element>;
    createPage(projectId: string, name: string): Promise<Page>;
    createProject(name: string): Promise<Project>;
    deleteElement(elementId: string): Promise<void>;
    deletePage(pageId: string): Promise<void>;
    deleteProject(projectId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getElements(pageId: string): Promise<Array<Element>>;
    getMyProjects(): Promise<Array<Project>>;
    getPages(projectId: string): Promise<Array<Page>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    reorderElements(pageId: string, elementIds: Array<string>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateElement(elementId: string, propsJson: string): Promise<void>;
    updatePage(pageId: string, name: string): Promise<void>;
    updateProjectName(projectId: string, name: string): Promise<void>;
}
