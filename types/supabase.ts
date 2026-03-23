export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            cart_items: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    quantity: number
                    size: string | null
                    color: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    quantity?: number
                    size?: string | null
                    color?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string
                    quantity?: number
                    size?: string | null
                    color?: string | null
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    useremail: string
                    items: Json
                    total: number
                    status: string | null
                    shippingaddress: string | null
                    shippingmethod: string | null
                    paymentmethod: string | null
                    timeline: Json | null
                    rating: number | null
                    reviewtext: string | null
                    isarchived: boolean | null
                    returns_info: Json | null
                    createdat: string | null
                    updatedat: string | null
                }
                Insert: {
                    id: string
                    user_id: string
                    useremail: string
                    items: Json
                    total: number
                    status?: string | null
                    shippingaddress?: string | null
                    shippingmethod?: string | null
                    paymentmethod?: string | null
                    timeline?: Json | null
                    rating?: number | null
                    reviewtext?: string | null
                    isarchived?: boolean | null
                    returns_info?: Json | null
                    createdat?: string | null
                    updatedat?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    useremail?: string
                    items?: Json
                    total?: number
                    status?: string | null
                    shippingaddress?: string | null
                    shippingmethod?: string | null
                    paymentmethod?: string | null
                    timeline?: Json | null
                    rating?: number | null
                    reviewtext?: string | null
                    isarchived?: boolean | null
                    returns_info?: Json | null
                    createdat?: string | null
                    updatedat?: string | null
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    price: number
                    originalprice: number | null
                    category: string
                    image: string | null
                    gallery: Json | null
                    description: string | null
                    tagline: string | null
                    rating: number | null
                    reviews: number | null
                    instock: boolean | null
                    stockquantity: number | null
                    sizes: Json | null
                    colors: Json | null
                    features: Json | null
                    specs: Json | null
                    tags: Json | null
                    gender: string | null
                    isdeleted: boolean
                    createdat: string | null
                    updatedat: string | null
                }
                Insert: {
                    id: string
                    name: string
                    price: number
                    originalprice?: number | null
                    category: string
                    image?: string | null
                    gallery?: Json | null
                    description?: string | null
                    tagline?: string | null
                    rating?: number | null
                    reviews?: number | null
                    instock?: boolean | null
                    stockquantity?: number | null
                    sizes?: Json | null
                    colors?: Json | null
                    features?: Json | null
                    specs?: Json | null
                    tags?: Json | null
                    gender?: string | null
                    isdeleted?: boolean
                    createdat?: string | null
                    updatedat?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    price?: number
                    originalprice?: number | null
                    category?: string
                    image?: string | null
                    gallery?: Json | null
                    description?: string | null
                    tagline?: string | null
                    rating?: number | null
                    reviews?: number | null
                    instock?: boolean | null
                    stockquantity?: number | null
                    sizes?: Json | null
                    colors?: Json | null
                    features?: Json | null
                    specs?: Json | null
                    tags?: Json | null
                    gender?: string | null
                    isdeleted?: boolean
                    createdat?: string | null
                    updatedat?: string | null
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    phone: string | null
                    role: string | null
                    avatar: string | null
                    addresses: Json | null
                    wallet_balance: number | null
                    createdat: string | null
                    updatedat: string | null
                }
                Insert: {
                    id: string
                    email: string
                    name?: string | null
                    phone?: string | null
                    role?: string | null
                    avatar?: string | null
                    addresses?: Json | null
                    wallet_balance?: number | null
                    createdat?: string | null
                    updatedat?: string | null
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    phone?: string | null
                    role?: string | null
                    avatar?: string | null
                    addresses?: Json | null
                    wallet_balance?: number | null
                    createdat?: string | null
                    updatedat?: string | null
                }
            }
        }
    }
}
