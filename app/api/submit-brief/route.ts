import { GoogleSpreadsheet } from 'google-spreadsheet'
import { NextRequest, NextResponse } from 'next/server'

const SHEET_ID = '10_YeOfKdjFaCBVvi-m-GiLGc0TduH-92JQ1GSzySMOI'

const serviceAccountAuth = {
  type: 'service_account',
  project_id: 'fudi-6d165',
  private_key_id: '4b618d6749400e3731a5e3d077c6f0941b6dbedf',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDXMWBlJKtIuTE6\n3f24G6vRzHHZvIkX3q62m/r2xM+5GxXDcFhOYTVLNILX3CclEXZ3Jo+zr8eDcx3y\nS/59O/6hq1lZmXOAnmIqnu46wbBacjJqfR4KKz2VVzTsUm8ZwAWCThs+llouzCZQ\nZ0z1U4pKvKnSWIwsz3edZ2JIp1YAf/986GIWaWa4XkXAEmQ2V/NC3HeEJv7d0L6b\nxUMXQmAytYbucmc2Vg+vkGjEfk8XK1/fcj4OloCrNY/TsnWZzwVBkLyRXUrsxvqJ\nteoSLvyvwQakYx1VQQtyZ/tDhFMqOT1xE10vbwBsUf27kpiD47Y7CWEElWLy470L\ngVG9c9R1AgMBAAECggEAFJBeoJO6PYsa+f/kQs98IiKaH59Nb4dDZWZu+11v50XA\nFOrbuXO/IsZsGYIriHaMflLkSRzLYVOjITgjY+bTjLIB6hbIq5oXEfEZnWpMdrwy\ndqwprnmW2zpX75xqCwknTZ42qsq16AJwx96zQz9eOAmi5du5239g9B0AzqYVCRuF\nRJEQJmSJnAQgHVYmHyWNR8MWHqDkmB8ysmx7IkkiULQFh+tt6xWgs9Ex/dyE8V63\noGA5l7iLpRcw4fdSTaObeb+V9wOZd82As/TXamTWkEtvyZwTGWXjQsTmRwvzLUzI\nM7hE9Jkhuq7D8RaOvQf1Wo8vuA2KJDt+lgo/t4wycQKBgQD6NoeRr4TsKGPG/Q8w\n4DjASAMIYBMLZw1H2AU/EB00DZYuVF7UnZu8K4iivwcwgsefhvQ80VNlMsie6wA/\nJnNSwecWGNF0XsY9KxZFaEzouf+8k3BnTKMnTM469cngEghVUbm3XCi70Evhks20\nOmW57xwJbaXIwEYHikguVXekZQKBgQDcK3+dr6KODvEebWf2jRArdLp5lhpMWXlF\nIq3Acq484WLn02B6d/aeI2RbTOguk7/gjXlwK6DiPNLt5esctc6JEN/VbxyATH/T\nKzLyg4KSTd1Tyv5PvbX9306EEFz8fbMWo9Ubv9/91tXXAIQRi0kDn3zMJlIOUSpv\nJP3rA9dG0QKBgB9MjuzUbeY0rzaHFU1h3vd+ipKTog49F9Yy2YUn+N84C99DwpEK\nHh8NuwvQpY+V7G6yLP8mmC4CikIG14MOxkJF6yhCdoD+EgI4z5JjF6vNCIaIUvk5\nBve1jd6mPFiBKPWzQW4EYzwLNFLFUGIJJAx8Mp+jTaetFZV/4MObAVpZAoGBANiW\nthESkdA8JLkxGZ/yv2BwkW1A25gWQPVhGxqB9qQPeTPjvjpcPzDsUjJ64sHHOXAW\n3MsbMEa/XSUJFJSGyaoO/pNBngEcwHalPZZTByUUElH3FNyvHRSlE+FZE5CTu5Tf\nEKsew6Q8Lts2N7XmlqpIwAU5AWnyMNNryZrjiWixAoGBAJr1t/jeMj+qJLuC5OAG\nPzb6pkp1jAoQ6jDW2/nLqHIc7PzKdhsecGSQx1sYp+WzF+X27CMeHLlc8JCrR6L0\nHIf1dJx8H+FOM47qAGlillrMq/ZuRR87bdDIqNC8mLghV8oIjYLsALxRGgRDr3Ft\nDAtIBPOrAxI+zm/bvjz4TfaR\n-----END PRIVATE KEY-----\n',
  client_email: 'aterea-sheets@fudi-6d165.iam.gserviceaccount.com',
  client_id: '106067438208962828447',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/aterea-sheets%40fudi-6d165.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const doc = new GoogleSpreadsheet(SHEET_ID, {
      email: serviceAccountAuth.client_email,
      key: serviceAccountAuth.private_key,
    } as any)

    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    await sheet.addRow({
      Timestamp: new Date().toISOString(),
      'Client Name': body.clientName || '',
      'Brand Name': body.brandName || '',
      Email: body.email || '',
      Instagram: body.instagram || '',
      Website: body.website || '',
      'What You Sell': body.whatYouSell || '',
      Products: JSON.stringify(body.products || []),
      'Push Products': body.pushProducts || '',
      'Customer Age': body.customerAge || '',
      'Customer Location': body.customerLocation || '',
      'Customer Interests': body.customerInterests || '',
      'Customer Seeks': body.customerSeeks || '',
      'Customer Why': body.customerWhy || '',
      Competitors: JSON.stringify(body.competitors || []),
      'Loved Brands': JSON.stringify(body.lovedBrands || []),
      'Avoid Brands': JSON.stringify(body.avoidBrands || []),
      Attributes: JSON.stringify(body.attributes || []),
      'Brand Person': body.brandPerson || '',
      Working: body.working || '',
      'Not Working': body.notWorking || '',
      Goals: JSON.stringify(body.goals || []),
      'Other Goal': body.otherGoal || '',
      '90 Days': body.ninetyDays || '',
      'One Thing': body.oneThing || '',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to submit brief' }, { status: 500 })
  }
}
