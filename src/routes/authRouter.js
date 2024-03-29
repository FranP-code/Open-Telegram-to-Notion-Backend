const Express = require('express');
const router = Express.Router()

const axios = require('axios')

router.post('/', async (req, res) => {

    console.log(req.body)

    async function requestAccessToken() {
        try {
            const reqData = {
                code: req.body.code,
                grant_type: "authorization_code",
                redirect_uri: "https://open-telegram-to-notion.vercel.app/auth"
            }

            const auth = {
                Authorization: "Basic " + Buffer.from(`${process.env.NOTION_INTEGRATION_ID}:${process.env.NOTION_INTEGRATION_SECRET}`).toString('base64')
            }

            console.log(auth)

            const response = await axios({
                method: "POST",
                url: "https://api.notion.com/v1/oauth/token",
                data: reqData,
                auth: {
                    username: Buffer.from(process.env.NOTION_INTEGRATION_ID.toString('base64')),
                    password: Buffer.from(process.env.NOTION_INTEGRATION_SECRET.toString('base64'))
                } //THANK YOU https://stackoverflow.com/questions/67534080/notion-api-invalid-client-oauth-integration/68699544#68699544?newreg=949504cf865c4a52b2c0ce7afe936c9b
            })

            console.log(response.status) //400 in positive case
            console.log(response.data)

            /**
             * access_token: string,
             * token_type: string,
             * bot_id: string,
             * workspace_name: string,
             * workspace_icon: string,
             * workspace_id: string
             */

            return response
        }
        catch (error) {
            console.log(error)
            return {status: 400, body: {data: error.response.data.error}}
        }
    }

    const response = await requestAccessToken()

    res.status(response.status).json(
        response.data
    )
})

module.exports = router