import { getSolidDataset, getThing, getStringNoLocale, responseToResourceInfo, isRawData, responseToSolidDataset, overwriteFile } from "@inrupt/solid-client";
import { login, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";
import { redirect } from "next/dist/server/api-utils";

export async function loginSolid(issuer) {
    const session = getDefaultSession();
    const oidcIssuer = new URL(issuer);
    console.log("Logging in with OIDC issuer:", oidcIssuer);
    // ensure url starts with https and ends with a /
    oidcIssuer.protocol = "https:";
    oidcIssuer.pathname = oidcIssuer.pathname.endsWith("/") ? oidcIssuer.pathname : `${oidcIssuer.pathname}/`;

    // Construct the redirect URL without the query parameters
    const redirectUrl = new URL(window.location.origin + window.location.pathname);

    if (!session.info.isLoggedIn) {
        return await login({
        oidcIssuer: oidcIssuer.href,
        redirectUrl: redirectUrl.href,
        });
    }

    return;
}

export async function fetchPodData() {
    // steps
    // 1. check if user is logged in
    // 2. get user's Pod
    // 3. fetch data from the Pod
    // 4. return

    // Step 1: check if user is logged in
    const session = getDefaultSession();
    
    if (!session.info.isLoggedIn) {
      console.error("User is not logged in.");
      return;
    }

    // Step 2: get user's Pod
    const fetcher = session.fetch;
    const webIdDoc = await fetcher(session.info.webId);
    const webIdDocUrl = webIdDoc.url;
    const webIdDataset = await responseToSolidDataset(webIdDoc);
    const profile = getThing(webIdDataset, webIdDocUrl);
    const podUrl = getStringNoLocale(profile, "http://www.w3.org/ns/pim/space#storage");

    // Step 3: fetch data from the Pod
    // Filepath: mastercard/mastercardtransactions/mastercard-data.json
    const fileUrl = `${podUrl}mastercard/mastercardtransactions/mastercard-data.json`;
    const fileDataset = await getSolidDataset(fileUrl, { fetcher });
    const fileThing = getThing(fileDataset, fileUrl);
    const fileResource = responseToResourceInfo(fileDataset, fileUrl);
    if (!isRawData(fileResource)) {
        console.error("The fetched data is not raw data.");
        return;
    }
    const fileContent = fileResource.data;

    // Step 4: return json data
    try {
        const data = JSON.parse(fileContent);
        return data;
    }
    catch (error) {
        console.error("Error parsing JSON data:", error);
    }

    return;
}