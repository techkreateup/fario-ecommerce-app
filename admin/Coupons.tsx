import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface Coupon {
    id: string
    code: string
    discounttype: 'percentage' | 'fixed'
    discountvalue: number
    minordervalue: number
    maxdiscount: number | null
    usagelimit: number | null
    usedcount: number
    isactive: boolean
    validfrom: string
    validuntil: string | null
    createdat: string
    updatedat: string
}

export default function AdminCoupons() {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://csyiiksxpmbehiiovlbg.supabase.co';
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const { user } = useAuth();

    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

    const [formData, setFormData] = useState({
        code: '',
        discounttype: 'percentage' as 'percentage' | 'fixed',
        discountvalue: '',
        minordervalue: '',
        maxdiscount: '',
        usagelimit: '',
        validuntil: ''
    })

    // Fetch coupons
    const fetchCoupons = async () => {
        const timeoutDuration = 10000;
        try {
            // Don't set loading to true on refresh to avoid flicker
            setError(null)
            console.log('📡 [AdminCoupons] Fetching from content_manifests view (GET Strategy)...');

            // Use 'content_manifests' View via REST to bypass hanging SDK
            const controller = new AbortController()
            const fetchTimeout = setTimeout(() => controller.abort(), timeoutDuration)

            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/content_manifests?select=*&order=createdat.desc`,
                {
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    },
                    signal: controller.signal
                }
            )

            clearTimeout(fetchTimeout)

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`)
            }

            const data = await response.json()

            console.log('✅ [AdminCoupons] Manifest loaded:', data?.length);
            setCoupons(data || [])
        } catch (err: any) {
            console.error('❌ [AdminCoupons] Error fetching view:', err)
            setError(err.message || 'Unknown error occurred')
        } finally {
            setLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchCoupons()
    }, [])

    // Real-time updates
    useEffect(() => {
        const channel = supabase.channel('public:coupons')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'coupons' },
                () => {
                    console.log('🔄 Coupons updated via real-time')
                    fetchCoupons()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Reset form
    const resetForm = () => {
        setFormData({
            code: '',
            discounttype: 'percentage',
            discountvalue: '',
            minordervalue: '',
            maxdiscount: '',
            usagelimit: '',
            validuntil: ''
        })
        setEditingCoupon(null)
        setShowForm(false)
    }

    // Create or Update coupon
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.code.trim()) {
            alert('Coupon code is required!')
            return
        }

        if (!formData.discountvalue || parseFloat(formData.discountvalue) <= 0) {
            alert('Discount value must be greater than 0!')
            return
        }

        try {
            const couponData = {
                code: formData.code.toUpperCase().trim(),
                discounttype: formData.discounttype,
                discountvalue: parseFloat(formData.discountvalue),
                minordervalue: parseFloat(formData.minordervalue) || 0,
                maxdiscount: formData.maxdiscount ? parseFloat(formData.maxdiscount) : null,
                usagelimit: formData.usagelimit ? parseInt(formData.usagelimit) : null,
                validuntil: formData.validuntil || null,
                isactive: true
            }

            if (editingCoupon) {
                // Update existing coupon via REST
                const res = await fetch(`${SUPABASE_URL}/rest/v1/coupons?id=eq.${editingCoupon.id}`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(couponData)
                })

                if (!res.ok) throw new Error('Failed to update coupon')
                alert('✅ Coupon updated successfully!')
            } else {
                // Create new coupon via REST
                const res = await fetch(`${SUPABASE_URL}/rest/v1/coupons`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({ ...couponData, usedcount: 0 })
                })

                if (!res.ok) {
                    if (res.status === 409) throw new Error('Coupon code already exists!')
                    throw new Error('Failed to create coupon')
                }
                alert('✅ Coupon created successfully!')
            }

            resetForm()
            fetchCoupons()
        } catch (err: any) {
            console.error('❌ Error saving coupon:', err)
            if (err.code === '23505') {
                alert('Coupon code already exists!')
            } else {
                alert('Error: ' + err.message)
            }
        }
    }

    // Edit coupon
    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon)
        setFormData({
            code: coupon.code,
            discounttype: coupon.discounttype,
            discountvalue: coupon.discountvalue.toString(),
            minordervalue: coupon.minordervalue.toString(),
            maxdiscount: coupon.maxdiscount?.toString() || '',
            usagelimit: coupon.usagelimit?.toString() || '',
            validuntil: coupon.validuntil || ''
        })
        setShowForm(true)
    }

    // Toggle active status
    const toggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/coupons?id=eq.${id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ isactive: !currentStatus })
            })

            if (!res.ok) throw new Error('Failed to update status')
            fetchCoupons()
        } catch (err: any) {
            alert('Error: ' + err.message)
        }
    }

    // Delete coupon
    const deleteCoupon = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return

        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/coupons?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            })

            if (!res.ok) throw new Error('Failed to delete coupon')
            alert('Coupon deleted!')
            fetchCoupons()
        } catch (err: any) {
            alert('Error: ' + err.message)
        }
    }

    // Loading state
    if (loading && coupons.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading coupons...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error && coupons.length === 0) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                    <h3 className="font-bold flex items-center gap-2">
                        ⚠️ Error Loading Coupons
                    </h3>
                    <p className="mt-2">{error}</p>
                    <button
                        onClick={() => { setLoading(true); fetchCoupons(); }}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        )
    }

    // Main render
    return (
        <div className="p-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🎟️ Coupons Management</h1>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">Total: {coupons.length}</span>
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded">Active: {coupons.filter(c => c.isactive).length}</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Redeemed: {coupons.reduce((sum, c) => sum + c.usedcount, 0)}</span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        resetForm()
                        setShowForm(!showForm)
                    }}
                    className={`px-6 py-2.5 rounded-lg font-medium transition shadow-sm ${showForm
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {showForm ? '✕ Cancel' : '+ Create Coupon'}
                </button>
            </div>

            {/* Create/Edit Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100 animate-in slide-in-from-top-4 duration-200">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Coupon Code */}
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Coupon Code *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono tracking-wide"
                                placeholder="SAVE20"
                                required
                                disabled={!!editingCoupon}
                            />
                        </div>

                        {/* Discount Type */}
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Discount Type *</label>
                            <select
                                value={formData.discounttype}
                                onChange={(e) => setFormData({ ...formData, discounttype: e.target.value as 'percentage' | 'fixed' })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (Rs. )</option>
                            </select>
                        </div>

                        {/* Discount Value */}
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">
                                Discount Value * {formData.discounttype === 'percentage' ? '(%)' : '(Rs. )'}
                            </label>
                            <input
                                type="number"
                                value={formData.discountvalue}
                                onChange={(e) => setFormData({ ...formData, discountvalue: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        {/* Min Order Value */}
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Min Order Value (Rs. )</label>
                            <input
                                type="number"
                                value={formData.minordervalue}
                                onChange={(e) => setFormData({ ...formData, minordervalue: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                min="0"
                                placeholder="0"
                            />
                        </div>

                        {/* Max Discount */}
                        {formData.discounttype === 'percentage' && (
                            <div>
                                <label className="block mb-2 font-semibold text-gray-700">Max Discount (Rs. )</label>
                                <input
                                    type="number"
                                    value={formData.maxdiscount}
                                    onChange={(e) => setFormData({ ...formData, maxdiscount: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    min="0"
                                    placeholder="Optional"
                                />
                            </div>
                        )}

                        {/* Usage Limit */}
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Usage Limit</label>
                            <input
                                type="number"
                                value={formData.usagelimit}
                                onChange={(e) => setFormData({ ...formData, usagelimit: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                min="1"
                                placeholder="Unlimited"
                            />
                        </div>

                        {/* Valid Until */}
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Valid Until</label>
                            <input
                                type="datetime-local"
                                value={formData.validuntil}
                                onChange={(e) => setFormData({ ...formData, validuntil: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3 border-t pt-6">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-8 py-2.5 rounded-lg hover:bg-green-700 font-medium transition shadow-sm"
                        >
                            {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-100 text-gray-700 px-8 py-2.5 rounded-lg hover:bg-gray-200 font-medium transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Coupons Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {coupons.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50">
                        <div className="text-4xl mb-4">🎫</div>
                        <p className="text-gray-500 text-lg font-medium">No coupons created yet</p>
                        <p className="text-gray-400 text-sm mt-1 mb-6">Create your first coupon to get started</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition"
                        >
                            Create Coupon
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usage</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {coupons.map(coupon => (
                                    <tr key={coupon.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                                                {coupon.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {coupon.discounttype === 'percentage'
                                                        ? `${coupon.discountvalue}%`
                                                        : `Rs. ${coupon.discountvalue}`}
                                                </span>
                                                {coupon.maxdiscount && coupon.discounttype === 'percentage' && (
                                                    <span className="text-xs text-gray-500">Max off: Rs. {coupon.maxdiscount}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            Rs. {coupon.minordervalue}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className="font-medium text-gray-900">{coupon.usedcount}</span>
                                            <span className="text-gray-400 mx-1">/</span>
                                            {coupon.usagelimit || '∞'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {coupon.validuntil
                                                ? new Date(coupon.validuntil).toLocaleDateString(undefined, {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })
                                                : <span className="text-gray-400">Never</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${coupon.isactive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {coupon.isactive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="text-blue-600 hover:text-blue-900 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => toggleActive(coupon.id, coupon.isactive)}
                                                    className={`${coupon.isactive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} hover:underline`}
                                                >
                                                    {coupon.isactive ? 'Disable' : 'Enable'}
                                                </button>
                                                <button
                                                    onClick={() => deleteCoupon(coupon.id)}
                                                    className="text-red-600 hover:text-red-900 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Real-time Sync Active
                </div>
                <div>
                    Admin ID: {user?.id?.slice(0, 8) || '...'}
                </div>
            </div>
        </div>
    )
}
