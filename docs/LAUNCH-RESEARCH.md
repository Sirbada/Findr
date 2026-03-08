# Findr Marketplace Launch Research - Cameroon

## Executive Summary
Research conducted for Findr marketplace launch in Cameroon covering payment APIs (MTN MoMo, Orange Money), SMS verification providers, legal requirements, and SEO keywords. Most APIs require merchant registration through local Orange/MTN stores with KYC compliance. SMS costs range from $0.10-0.15 per message. Legal framework exists but specific registration requirements need verification with local counsel.

## 1. MTN MoMo API Integration

### API Access
- **Developer Portal:** https://momodeveloper.mtn.com/
- **Sandbox URL:** Available through developer portal (requires registration)
- **Production URL:** Obtained through Partner Portal after merchant approval
- **API Documentation:** https://momodeveloper.mtn.com/api-documentation

### Merchant Registration Process
- **Requirement:** Must be registered as MTN MoMo merchant through local MTN stores in Cameroon
- **KYC Compliance:** Full Know Your Customer verification required
- **Documents Required:** 
  - Trade registration documents
  - Personal Property Credit Register documents
  - Business license
  - Tax identification
- **Process:** Visit MTN Cameroon store → Complete merchant application → API access granted after approval

### Fee Structure (2026)
| Transaction Type | Amount Range | Fees |
|------------------|--------------|------|
| Transfers | 100-10,000 CFA | 50 CFA + 4 CFA TTA |
| Transfers | 10,000-200,000 CFA | 0.5% + 4 CFA TTA |
| Transfers | 200,001-500,000 CFA | 1,000 CFA + 4 CFA TTA |
| Merchant Payments | All amounts | Free for customers |
| Withdrawals | 100-3,333 CFA | 50 CFA + 4 CFA TTA |
| Withdrawals | 3,334-175,000 CFA | 1.5% + 4 CFA TTA |

### Contact
- **Support:** support@homeland.mtn.com
- **Partner Support:** 8403
- **General Support:** 8787

## 2. Orange Money API Integration

### API Access
- **Developer Portal:** https://developer.orange.com/
- **WebPay API:** https://developer.orange.com/apis/om-webpay
- **Cameroon Specific URL:** https://api.orange.com/orange-money-webpay/cm/v1/webpayment
- **Countries Supported:** Mali, Cameroon, Senegal, Madagascar, Botswana, Guinea Conakry, Sierra Leone, Cote d'Ivoire, Guinea Bissau, Liberia, RD Congo, Central African Republic

### Merchant Registration Process
- **Requirement:** Must register as Orange Money merchant at local Orange store in Cameroon
- **Application:** Sign up for Web Payment/M Payment service in Orange store
- **KYC Required:** Full compliance with financial service regulations
- **Integration Partners:** 1-2 certified integration partners available in Cameroon to assist with development

### Payment Process for Users
1. Customer selects Orange Money as payment method
2. Customer generates OTP via Orange Money USSD service (*126#)
3. Customer enters temporary password on payment screen
4. Transaction completed

### Fee Structure
- Fees not publicly disclosed on developer portal
- Contact local Orange Cameroon store for current merchant fee structure
- Standard mobile money transaction fees apply for end users

### Contact
- **Local Registration:** Visit Orange Cameroon stores
- **Technical Support:** Through developer portal after registration

## 3. SMS Verification Providers

### Twilio (Primary Recommendation)
- **Pricing URL:** https://www.twilio.com/en-us/sms/pricing/cm
- **Country Code:** 237 (Cameroon)
- **Features Available:**
  - International Numbers (non-domestic)
  - Alphanumeric Sender ID (custom name instead of phone number)
  - SMS delivery to 150+ locales
- **Pricing:** 
  - Outbound SMS: Pricing not disclosed in public documentation
  - Volume discounts available
  - Enterprise pricing for high-volume users
- **Additional Features:**
  - SMS pumping protection ($0.025 per message)
  - Engagement Suite with link shortening ($0.015, first 1,000 free monthly)
- **Restrictions:** Alphanumeric Sender IDs are case-sensitive

### Vonage
- **Support URL:** https://api.support.vonage.com/hc/en-us/articles/204017303-Cameroon-SMS-Features-and-Restrictions
- **Country Code:** 237 (Cameroon)
- **Region:** Africa
- **MCC:** 624 (Mobile Country Code)
- **Sender ID:** Alphanumeric Sender ID supported
- **Features:** Case-sensitive Sender IDs

### Africa's Talking
- **Website:** https://africastalking.com/sms
- **Documentation:** https://developers.africastalking.com/docs/sms/overview
- **Focus:** Interactive messaging for African businesses
- **Services:** Bulk SMS, Short codes, Branded messaging
- **Coverage:** Primarily East Africa (Kenya, Uganda, Tanzania) - Verify Cameroon availability

### Recommendations
1. **Twilio** - Most comprehensive, global reach, proven reliability
2. **Vonage** - Good alternative with Africa focus
3. **Africa's Talking** - Verify Cameroon coverage before implementation
4. **Local Providers** - Consider MTN/Orange SMS APIs for better local rates

## 4. Legal Requirements

### E-commerce Legal Framework
- **Governing Law:** Law No. 2010/021 of 21 December 2010 governing e-commerce in Cameroon
- **Regulator:** MINPOSTEL (Ministry of Posts and Telecommunications)
- **Website:** https://www.minpostel.gov.cm/

### Required Legal Documents

#### Mentions Légales (Legal Notices)
**Must Include:**
- Company name and legal form
- Registration number and place of registration
- VAT number (if applicable)
- Business address
- Contact information (email, phone)
- Website hosting provider details
- Domain name registration details

#### CGU (Conditions Générales d'Utilisation) - Terms of Use
**Must Include:**
- Platform usage rules
- User account terms
- Content policy
- Intellectual property rights
- Data protection and privacy policy
- Dispute resolution procedures
- Liability limitations
- Termination conditions

#### CGV (Conditions Générales de Vente) - Terms of Sale
**Must Include:**
- Product/service descriptions
- Pricing and payment terms
- Delivery conditions
- Return and refund policy
- Warranty information
- Force majeure clauses

### MINPOSTEL Registration
- **Status:** Registration requirements not clearly defined in current documentation
- **Action Required:** Contact MINPOSTEL directly to clarify marketplace registration requirements
- **Contact:** Visit https://www.minpostel.gov.cm/ for current requirements

### Data Protection
- Follow Cameroon's data protection laws (based on French CNIL framework)
- Implement privacy policy compliant with local regulations
- Ensure secure data storage and processing

### Recommendations
1. Engage local legal counsel (estimated cost: €1,000+ for CGU/CGV drafting)
2. Contact MINPOSTEL directly for marketplace-specific requirements
3. Review Law No. 2010/021 of 21 December 2010 in detail
4. Implement GDPR-like privacy policies as best practice

## 5. SEO Keywords for Cameroon

### Real Estate Keywords (High Priority)
- **Primary Cities:** Douala, Yaoundé, Bafoussam, Garoua, Bamenda
- **Property Types:**
  - "terrain à vendre" (land for sale)
  - "maison à louer" (house for rent)
  - "appartement Douala" (apartment Douala)
  - "villa Yaoundé" (villa Yaoundé)
  - "bureau à louer" (office for rent)
  - "parcelle Douala" (plot Douala)

### Automotive Keywords (High Priority)
- **Vehicle Types:**
  - "voiture occasion" (used car)
  - "4x4 Cameroun" (SUV Cameroon)
  - "moto occasion" (used motorcycle)
  - "camion à vendre" (truck for sale)
  - "pièces auto" (auto parts)
  - "garage Douala" (garage Douala)

### Location-Based Keywords
- **Douala:** "... Douala", "... Akwa", "... Bonanjo", "... Deido"
- **Yaoundé:** "... Yaoundé", "... Bastos", "... Mfoundi", "... Emombo"
- **Other Cities:** Bafoussam, Garoua, Bamenda, Maroua, Ngaoundéré

### French Language Optimization
- **Primary Language:** French (official)
- **Local Languages:** English (official), Fulfulde, Ewondo, others
- **Content Strategy:** French-first with English translations
- **Meta Tags:** Optimize for French search terms

### Search Behavior Insights
- **Mobile-First:** High mobile internet usage in Cameroon
- **Local Preferences:** Prefer local businesses and trusted sellers
- **Payment Methods:** Cash on delivery still preferred
- **Social Proof:** Reviews and testimonials highly valued

### Keyword Research Tools
- Google Keyword Planner (set location to Cameroon)
- Google Trends for Cameroon
- Local SEO agencies: Rozefs Marketing (Yaoundé/Douala)

### Competitive Analysis
- **Real Estate:** diaspora-immo.com, bboyo.com, 4321property.com
- **General Marketplace:** Local classified sites and Facebook Marketplace

## Implementation Priority

### Phase 1 (Launch Ready)
1. MTN MoMo merchant registration
2. Orange Money merchant registration  
3. Twilio SMS integration
4. Basic legal documents (CGU/CGV)

### Phase 2 (Post-Launch)
1. MINPOSTEL registration clarification
2. Local SMS provider evaluation
3. SEO optimization implementation
4. Legal compliance audit

### Next Steps
1. **Contact MTN/Orange stores** in Douala/Yaoundé for merchant registration
2. **Engage Cameroon legal counsel** for CGU/CGV and regulatory compliance
3. **Set up Twilio account** and test SMS delivery to Cameroon numbers
4. **Contact MINPOSTEL** directly for marketplace registration requirements
5. **Implement French-language SEO strategy** with focus on Douala/Yaoundé keywords

---
*Research completed: February 10, 2026*
*Sources: Official websites, government portals, industry documentation*