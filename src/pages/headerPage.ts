import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


//  Page object is not IMPLEMENTED for the time-being for Marvel Project, 
// we are using playwrigt inbuild page funtionality for the time being

export default class HeaderPage {
    private base: PlaywrightWrapper;
    constructor(private page: Page
    ) {
        this.base = new PlaywrightWrapper(page);
    }

    private headerPageElements = {
        searchInput: "Search books or authors",
        logoutLink: "//button[text()='Logout' and @role='menuitem']"
    }


}