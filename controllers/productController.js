import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateNewProduct, validateProduct } from '../utils/validations.js'
import Product from '../models/Product.js'

export const registerProduct = async (req, res) => {
    try {
        const { name, description, category, available, price: {value}, vendor } = req.body

        const newProduct = {name, description, category, available, value, vendor}
        const x = await validateNewProduct(newProduct)
        if(x){
            return res.status(422).json({msg: x})
        }

        // OBJECT PRODUCT
        const product = new Product({
            name,
            description,
            category,
            available,
            price: {value: value},
            vendor
        })

        try {
            await product.save()
            res.status(201).json({msg: 'Product created!', product})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: 'Server error. Please, try again!'})
        }

    } catch (e) {
        console.error(e)
        res.status(400).json({msg: 'Invalid request. Please, try again!'})
    }
}

export const getProduct =  async (req, res) => {
    const id = req.params.id

    const product = await validateProduct(await Product.findById(id))

    return res.status(product.htmlStatus).json({ msg: product.msg })
}

export const getAllProducts = async (req, res) => {
    const products = await validateProduct(await Product.find({}))

    return res.status(products.htmlStatus).json({ msg: products.msg })    
}

export const updateProduct = async (req, res) => {/*
    try {
        const {name, passwordOld, passwordNew} = req.body
        const id = req.params.id

        const productCheck = await validateProduct(await Product.findById(id))

        if(productCheck.htmlStatus === 404){
            return res.status(productCheck.htmlStatus).json({ msg: productCheck.msg }) 
        }

        // KEEP USER OBJ FROM DB
        const product = productCheck.msg
        
        if(passwordOld && passwordNew) {
            // PASSWORD CHECK AND UPDATE
            if(product.changePasswordAttemps >= 5){
                return res.status(403).json({ msg: 'After a limited number of failed attempts to change password, this option will be temporarily blocked. This lock lasts about an hour and will then clear on its own.'})
            }

            const isPasswordValid = await validatePassword(passwordOld, product.password)
            if(!isPasswordValid){
                product.changePasswordAttemps += 1
                await product.save()
                return res.status(422).json({ msg: 'Incorrect password!' })
            }

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(passwordNew, salt)
            product.password = passwordHash
        }
        
        if(name){
            product.name = name
        }     

        try {
            await product.save()
            res.status(200).json({msg: 'Product updated!'})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: 'Server error. Please, try again!'})
        }

    } catch (e) {
        console.error(e)
        res.status(400).json({msg: 'Invalid request. Please, try again!'})
    }
*/}

export const removeProduct = async (req, res) => {/*
    try {
        const id = req.params.id

        const productCheck = await validateProduct(await Product.findById(id))

        if(productCheck.htmlStatus == 404){
            return res.status(productCheck.htmlStatus).json({ msg: productCheck.msg }) 
        }

        // KEEP USER OBJ FROM DB
        const product = productCheck.msg

        try {
            const query = await product.deleteOne({id: id})
            res.status(200).json({msg: query})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: 'Server error. Please, try again!'})
        }

    } catch (e) {
        console.error(e)
        res.status(400).json({msg: 'Invalid request. Please, try again!'})
    }
*/}

export const removeWhere = async (req, res) => {
    try {
        const condition = req.body.condition

        try {
            const query = await Product.deleteMany(condition)
            res.status(200).json({'Documents deleted ': query.deletedCount})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: 'Server error. Please, try again!'})
        }

    } catch (e) {
        console.error(e)
        res.status(400).json({msg: 'Invalid request. Please, try again!'})
    }
}