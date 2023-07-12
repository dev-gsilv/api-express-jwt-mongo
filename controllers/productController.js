import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateNewProduct, productExist, modifiedCast, roundOff } from '../utils/validations.js'
import Product from '../models/Product.js'

export const registerProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            category, 
            available, 
            price: {
                value, 
                discount: {
                    activeDiscount, 
                    discountPercent
                }
            },
            vendor
        } = req.body

        const requiredFields = {name, description, value} //category, available, activeDiscount and discountPercent have default value from model (other, false, false, 0). Vendor: should be retrieved from session ID.
        const missingInfo = await validateNewProduct(requiredFields)
        if(missingInfo){
            return res.status(422).json({msg: missingInfo})
        }
        
        // OBJECT PRODUCT
        const product = new Product({
            name,
            description,
            category: modifiedCast(category),
            available: modifiedCast(available),
            price: {
                value: roundOff(value),
                discount: {
                    activeDiscount: modifiedCast(activeDiscount), 
                    discountPercent: modifiedCast(discountPercent)
                }
            },
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

    const product = await productExist(await Product.findById(id))

    return res.status(product.htmlStatus).json({ msg: product.msg })
}

export const getAllProducts = async (req, res) => {
    const products = await productExist(await Product.find({}))

    return res.status(products.htmlStatus).json({ msg: products.msg })    
}

export const updateProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            category, 
            available, 
            price: {
                value, 
                discount: {
                    activeDiscount, 
                    discountPercent
                }
            }
        } = req.body

        const id = req.params.id

        const check = await productExist(await Product.findById(id))

        if(check.htmlStatus === 404){
            return res.status(check.htmlStatus).json({ msg: check.msg }) 
        }

        // KEEP VALIDATED PRODUCT OBJ FROM DB
        const product = check.msg
        

        // UPDATE PRODUCT
        product.name = name
        product.description = description
        product.category = category
        product.availible = available
        product.price.value = value  
        product.price.discount.activeDiscount = activeDiscount
        product.price.discount.discountPercent = discountPercent   

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
}

export const removeProduct = async (req, res) => {
    try {
        const id = req.params.id

        const check = await productExist(await Product.findById(id))

        if(check.htmlStatus == 404){
            return res.status(check.htmlStatus).json({ msg: check.msg }) 
        }

        // KEEP PRODUCT OBJ FROM DB
        const product = check.msg

        try {
            const query = await product.deleteOne({id: id})
            res.status(200).json({msg: query.name + " (id: " + query._id + ") " + 'removed from database!'})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: 'Server error.' + e + ' Please, try again!'})
        }

    } catch (e) {
        console.error(e)
        res.status(400).json({msg: 'Invalid request. Please, try again!'})
    }
}

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