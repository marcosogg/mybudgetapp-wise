import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { parse } from 'https://deno.land/std@0.181.0/encoding/csv.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { filePath, userId } = await req.json()

    if (!filePath || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('temp_csv_files')
      .download(filePath)

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      return new Response(
        JSON.stringify({ error: 'Failed to download file' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Parse CSV content
    const csvText = await fileData.text()
    const [headers, ...rows] = parse(csvText, { skipFirstRow: false })

    // Validate required columns
    const requiredColumns = ['date', 'description', 'amount']
    const headerMap = new Map(
      headers.map((header: string, index: number) => [header.toLowerCase().trim(), index])
    )

    const missingColumns = requiredColumns.filter(
      col => !Array.from(headerMap.keys()).includes(col)
    )

    if (missingColumns.length > 0) {
      return new Response(
        JSON.stringify({ error: `Missing required columns: ${missingColumns.join(', ')}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Process rows and insert into transactions table
    const transactions = rows.map((row: string[]) => ({
      user_id: userId,
      date: row[headerMap.get('date')!],
      description: row[headerMap.get('description')!],
      amount: parseFloat(row[headerMap.get('amount')!]),
      tags: [],
    }))

    // Insert transactions in batches of 100
    const batchSize = 100
    const results = []
    
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize)
      const { data, error } = await supabase
        .from('transactions')
        .insert(batch)
        .select()

      if (error) {
        console.error('Error inserting batch:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to insert transactions' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      results.push(...(data || []))
    }

    // Clean up: Delete the temporary CSV file
    const { error: deleteError } = await supabase
      .storage
      .from('temp_csv_files')
      .remove([filePath])

    if (deleteError) {
      console.error('Error deleting temporary file:', deleteError)
    }

    return new Response(
      JSON.stringify({
        message: 'CSV processed successfully',
        transactionsCreated: results.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})