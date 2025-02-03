import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { transactions, userId } = await req.json()

    if (!transactions || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Processing ${transactions.length} transactions for user ${userId}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Filter out transactions with invalid dates only
    const validTransactions = transactions.filter(transaction => {
      const date = transaction.date?.trim();
      return date && !isNaN(Date.parse(date));
    });

    if (validTransactions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid transactions found. Make sure transactions have valid dates.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Found ${validTransactions.length} valid transactions out of ${transactions.length} total`)

    const batchSize = 100
    const results = []
    const skippedDuplicates = []
    
    for (let i = 0; i < validTransactions.length; i += batchSize) {
      const batch = validTransactions.slice(i, i + batchSize)
      console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(validTransactions.length/batchSize)}`)
      
      for (const transaction of batch) {
        const { data: existingTransaction } = await supabase
          .from('transactions')
          .select()
          .eq('user_id', userId)
          .eq('date', transaction.date)
          .eq('description', transaction.description)
          .eq('amount', transaction.amount)
          .maybeSingle()

        if (!existingTransaction) {
          const { data, error } = await supabase
            .from('transactions')
            .insert([transaction])
            .select()

          if (error) {
            console.error('Error inserting transaction:', error)
            throw error
          }

          if (data) {
            results.push(...data)
          }
        } else {
          console.log('Skipping duplicate transaction:', transaction)
          skippedDuplicates.push(transaction)
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Transactions processed successfully',
        transactionsCreated: results.length,
        totalTransactions: transactions.length,
        validTransactions: validTransactions.length,
        skippedTransactions: transactions.length - validTransactions.length,
        skippedDuplicates: skippedDuplicates.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})