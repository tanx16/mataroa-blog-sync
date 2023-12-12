import { RequestUrlParam, RequestUrlResponse, requestUrl} from 'obsidian';

export const BASE_URL = 'https://mataroa.blog/api/posts/';

export class Api {
    apiKey: string;
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private makeSlug(title: string) {
        // Assumes that the slug is the title, but slugified. E.g. Updating blog = updating-blog
        // This is really hacky, but it's fine as long as we're consistent.
        return title.toLowerCase().replaceAll(' ', '-');
    }

    async makeNewPost(title: string, body: string) {
        const postData = {
            'title': title,
            'body': body,
        }
        const options : RequestUrlParam = {
            url: BASE_URL,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.apiKey,
            },
            body: JSON.stringify(postData),
        }
        let response : RequestUrlResponse;
        try {
            response = await requestUrl(options);
            return response.text;
        }
        catch(e) {
            console.log(JSON.stringify(e));
        }
    }

    async deletePost(title: string) {
        // Assumes that the slug is the title, but slugified. E.g. Updating blog = updating-blog
        // This is really hacky, but it's fine as long as we're consistent.
        const curr_slug = this.makeSlug(title);
        const options : RequestUrlParam = {
            url: BASE_URL + curr_slug + '/',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.apiKey,
            },
        }
        let response : RequestUrlResponse;
        try {
            response = await requestUrl(options);
            return JSON.parse(response.text);
        }
        catch(e) {
            console.log(JSON.stringify(e));
        }
    }

    async getPost(title: string) {
        const curr_slug = this.makeSlug(title);
        const options : RequestUrlParam = {
            url: BASE_URL + curr_slug + '/',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.apiKey,
            },
        }
        let response : RequestUrlResponse;
        try {
            response = await requestUrl(options);
            return JSON.parse(response.text);
        }
        catch(e) {
            console.log(JSON.stringify(e));
        }
    }

    async updatePost(title: string, body: string) {
        const curr_slug = this.makeSlug(title);
        const postData = {
            'title': title,
            'body': body,
        }
        const options : RequestUrlParam = {
            url: BASE_URL + curr_slug + '/',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.apiKey,
            },
            body: JSON.stringify(postData),
        }
        let response : RequestUrlResponse;
        try {
            response = await requestUrl(options);
            return response.text;
        }
        catch(e) {
            console.log(JSON.stringify(e));
        }

    }
    
    async publishPost(title: string) {
        const curr_slug = this.makeSlug(title);
        const postData = {
            'published_at': new Date().toISOString().substring(0, 10),
        }
        const options : RequestUrlParam = {
            url: BASE_URL + curr_slug + '/',
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.apiKey,
            },
            body: JSON.stringify(postData),
        }
        let response : RequestUrlResponse;
        try {
            response = await requestUrl(options);
            return response.text;
        }
        catch(e) {
            console.log(JSON.stringify(e));
        }

    }
}
