// only use this in server
'use server';

import { headers } from "next/headers";
import { auth } from "../auth";
import { withErrorHandling } from "../utils";

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

})