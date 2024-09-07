import { getSolidDataset, getThing, getContentType, getSourceUrl, getFile, getStringNoLocale, responseToResourceInfo, isRawData, responseToSolidDataset, overwriteFile } from "@inrupt/solid-client";
import { login, getDefaultSession, fetch } from "@inrupt/solid-client-authn-browser";
import { redirect } from "next/dist/server/api-utils";

export async function loginSolid(issuer) {
    const session = getDefaultSession();
    const oidcIssuer = new URL(issuer);
    console.log("Logging in with OIDC issuer:", oidcIssuer);

    // Ensure URL starts with https and ends with a /
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
    const podUrl = session.info.webId.replace("/profile/card#me", "/");

    // Step 3: fetch data from the Pod
    // Filepath: mastercard/mastercardtransactions/mastercard-data.json
    const fileUrl = `${podUrl}mastercard/mastercardtransactions/mastercard-data.json`;

    const fileResource = await getFile(
        fileUrl,
        { fetch: fetcher }
    );

    // Step 4: parse blob to json
    const fileContent = JSON.parse(await fileResource.text());
    console.log("File content:", fileContent);
    return fileContent;
}