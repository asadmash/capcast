// only use this in server
'use server';

import { headers } from "next/headers";
import { auth } from "../auth";
import { getEnv, withErrorHandling } from "../utils";
import { BUNNY } from "@/constants";

// all keys from constants and env
const VIDEO_STREAM_BASE_URL = BUNNY.STREAM_BASE_URL;
const THUMBNAIL_STORAGE_BASE_URL = BUNNY.STORAGE_BASE_URL;
const THUMBNAIL_CDN_URL = BUNNY.CDN_URL;
const BUNNY_LIBRARY_ID = getEnv('BUNNY_LIBRARY_ID');
const ACCESS_KEYS = {
    streamAccessKey: getEnv('BUNNY_STREAM_ACCESS_KEY'),
    storageAccessKey: getEnv('BUNNY_STORAGE_ACCESS_KEY')
}

// Helper functions
const getSessionUserId = async ():Promise<string> => {
    const session = await auth.api.getSession({headers: await headers()});

    // when there is no session
    if(!session) throw new Error('unauthenticated');
    // if there is a session
    return session.user.id;
}

//Server actions

export const getVideoUploadUrl = withErrorHandling(async () => {
await getSessionUserId();

// set the base url of the stream
})