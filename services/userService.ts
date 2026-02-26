export const userService = {
    async getProfile(email: string) {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error("Profile fetch error:", error);
            return null;
        }
        return data;
    },

    async updateAddress(email: string, addresses: any[]) {
        const { supabase } = await import('../lib/supabase');
        return await supabase
            .from('profiles')
            .update({
                addresses,
                updated_at: new Date().toISOString()
            })
            .eq('email', email);
    }
};
