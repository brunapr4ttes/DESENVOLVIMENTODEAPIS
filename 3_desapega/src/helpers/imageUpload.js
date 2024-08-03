import multer from 'multer'


import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const imageStore = multer.diskStorage({
    destination: (request, file, cb) => {
        let folter = ""

        if (request.baseUrl.includes("usuarios")) {
            folter = "usuarios"
        } else if (request.baseUrl.includes("objetos")) {
            folter = "objetos"
        }
        cb(null, path.join(__dirname, `../public/${folter}`))
    },
    filename: (request, file, cb) => {
        cb(null, Date.now() + String(Math.floor(Math.random() * 100000)) +
            path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStore,
    fileFilter(request, file, cb) {
        if (!file.originalname.match(/\.(png||jpg)$/)) {
            return cb(new Error("Por favor, envie apenas jpg ou png!"))
        }
        cb(null, true)
    }
})

export default imageUpload;