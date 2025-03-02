export default async function fileUpload(params) {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post(`fileupload`, params)
    return await response.data;
}