import puppeteer, { Browser, Page } from "puppeteer";
import { ElementHandle } from "puppeteer";
import { uploadBuffer } from "../utils/aws";

const extractChapter = async (mangaId: string, chapterId: string): Promise<string[]> => {
    const ChapterUrl = `https://chapmanganato.to/manga-${mangaId}/chapter-${chapterId}`;

    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(ChapterUrl);

    const chapterImageElements = await page.$$(".container-chapter-reader img");
    let chapterImages: Buffer[] = [];
    let pageNumber = 0;
    let chapterImgLinks: string[] = [];

    for (const element of chapterImageElements) {
        const screenshot = await screenshotElement(element, page);
        if (screenshot) {
            console.log("extracted page", pageNumber);
            chapterImgLinks.push(`https://manga-reader-chapters.s3.us-west-2.amazonaws.com/manga-${mangaId}/chapter-${chapterId}/page-${pageNumber}.jpg`);
            chapterImages.push(screenshot);
            pageNumber++;
        }
    }

    await page.close();
    await browser.close();

    for (let i = 0; i < chapterImages.length; i++) {
        await uploadBuffer("manga-reader-chapters", `manga-${mangaId}/chapter-${chapterId}`, `page-${i}.jpg`, chapterImages[i]);
        console.log("uploaded page", i);
    }
    console.log("uploaded all pages");

    return chapterImgLinks;
};

const screenshotElement = async (element: ElementHandle, page: Page): Promise<Buffer | null> => {
    const boundingBox = await element.boundingBox();
    if (!boundingBox || boundingBox.height < 1000) {
        return null;
    }

    await page.evaluate((boundingBox) => {
        window.scrollTo(boundingBox.x, boundingBox.y);
    }, boundingBox);

    return await element.screenshot({
        type: "jpeg",
        quality: 70,
    });
};

export default extractChapter;
