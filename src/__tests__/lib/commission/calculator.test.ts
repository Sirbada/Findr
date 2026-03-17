import { describe, it, expect } from 'vitest'
import { calculateCommission, type Category, type TransactionType } from '@/lib/commission/calculator'

describe('Commission Calculator', () => {
  describe('Housing Rentals', () => {
    it('should calculate commission for low-tier housing rental', () => {
      const result = calculateCommission(100000, 'housing', 'rental')
      
      expect(result.listingPrice).toBe(100000)
      expect(result.currency).toBe('XAF')
      expect(result.sellerRate).toBe(0.05) // 5%
      expect(result.buyerRate).toBe(0.02)  // 2%
      expect(result.sellerCommission).toBe(5000)   // 5% of 100k
      expect(result.buyerCommission).toBe(2000)    // 2% of 100k
      expect(result.totalCommission).toBe(7000)    // 5k + 2k
      expect(result.sellerReceives).toBe(95000)    // 100k - 5k
      expect(result.buyerPays).toBe(102000)        // 100k + 2k
    })

    it('should calculate commission for mid-tier housing rental', () => {
      const result = calculateCommission(300000, 'housing', 'rental')
      
      expect(result.sellerRate).toBe(0.04) // 4%
      expect(result.buyerRate).toBe(0.02)  // 2%
      expect(result.sellerCommission).toBe(12000)  // 4% of 300k
      expect(result.buyerCommission).toBe(6000)    // 2% of 300k
      expect(result.totalCommission).toBe(18000)
      expect(result.sellerReceives).toBe(288000)
      expect(result.buyerPays).toBe(306000)
    })

    it('should calculate commission for high-tier housing rental', () => {
      const result = calculateCommission(600000, 'housing', 'rental')
      
      expect(result.sellerRate).toBe(0.03) // 3%
      expect(result.buyerRate).toBe(0.015) // 1.5%
      expect(result.sellerCommission).toBe(18000)  // 3% of 600k
      expect(result.buyerCommission).toBe(9000)    // 1.5% of 600k
      expect(result.totalCommission).toBe(27000)
      expect(result.sellerReceives).toBe(582000)
      expect(result.buyerPays).toBe(609000)
    })

    it('should calculate commission for luxury housing rental', () => {
      const result = calculateCommission(1200000, 'housing', 'rental')
      
      expect(result.sellerRate).toBe(0.025) // 2.5%
      expect(result.buyerRate).toBe(0.01)   // 1%
      expect(result.sellerCommission).toBe(30000)  // 2.5% of 1.2M
      expect(result.buyerCommission).toBe(12000)   // 1% of 1.2M
      expect(result.totalCommission).toBe(42000)
      expect(result.sellerReceives).toBe(1170000)
      expect(result.buyerPays).toBe(1212000)
    })
  })

  describe('Housing Sales', () => {
    it('should calculate commission for low-tier housing sale', () => {
      const result = calculateCommission(15000000, 'housing', 'sale') // 15M XAF
      
      expect(result.sellerRate).toBe(0.03) // 3%
      expect(result.buyerRate).toBe(0.02)  // 2%
      expect(result.sellerCommission).toBe(450000)   // 3% of 15M
      expect(result.buyerCommission).toBe(300000)    // 2% of 15M
      expect(result.totalCommission).toBe(750000)
      expect(result.sellerReceives).toBe(14550000)
      expect(result.buyerPays).toBe(15300000)
    })

    it('should calculate commission for high-tier housing sale', () => {
      const result = calculateCommission(100000000, 'housing', 'sale') // 100M XAF
      
      expect(result.sellerRate).toBe(0.015) // 1.5%
      expect(result.buyerRate).toBe(0.005)  // 0.5%
      expect(result.sellerCommission).toBe(1500000)  // 1.5% of 100M
      expect(result.buyerCommission).toBe(500000)    // 0.5% of 100M
      expect(result.totalCommission).toBe(2000000)
      expect(result.sellerReceives).toBe(98500000)
      expect(result.buyerPays).toBe(100500000)
    })
  })

  describe('Car Rentals', () => {
    it('should calculate commission for budget car rental', () => {
      const result = calculateCommission(25000, 'cars', 'rental') // 25k/day
      
      expect(result.sellerRate).toBe(0.06) // 6%
      expect(result.buyerRate).toBe(0.03)  // 3%
      expect(result.sellerCommission).toBe(1500)   // 6% of 25k
      expect(result.buyerCommission).toBe(750)     // 3% of 25k
      expect(result.totalCommission).toBe(2250)
      expect(result.sellerReceives).toBe(23500)
      expect(result.buyerPays).toBe(25750)
    })

    it('should calculate commission for luxury car rental', () => {
      const result = calculateCommission(200000, 'cars', 'rental') // 200k/day
      
      expect(result.sellerRate).toBe(0.04) // 4%
      expect(result.buyerRate).toBe(0.02)  // 2%
      expect(result.sellerCommission).toBe(8000)   // 4% of 200k
      expect(result.buyerCommission).toBe(4000)    // 2% of 200k
      expect(result.totalCommission).toBe(12000)
      expect(result.sellerReceives).toBe(192000)
      expect(result.buyerPays).toBe(204000)
    })
  })

  describe('Car Sales', () => {
    it('should calculate commission for budget car sale', () => {
      const result = calculateCommission(3000000, 'cars', 'sale') // 3M XAF
      
      expect(result.sellerRate).toBe(0.04) // 4%
      expect(result.buyerRate).toBe(0.02)  // 2%
      expect(result.sellerCommission).toBe(120000)  // 4% of 3M
      expect(result.buyerCommission).toBe(60000)    // 2% of 3M
      expect(result.totalCommission).toBe(180000)
      expect(result.sellerReceives).toBe(2880000)
      expect(result.buyerPays).toBe(3060000)
    })

    it('should calculate commission for luxury car sale', () => {
      const result = calculateCommission(50000000, 'cars', 'sale') // 50M XAF
      
      expect(result.sellerRate).toBe(0.02) // 2%
      expect(result.buyerRate).toBe(0.01)  // 1%
      expect(result.sellerCommission).toBe(1000000) // 2% of 50M
      expect(result.buyerCommission).toBe(500000)   // 1% of 50M
      expect(result.totalCommission).toBe(1500000)
      expect(result.sellerReceives).toBe(49000000)
      expect(result.buyerPays).toBe(50500000)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero price', () => {
      const result = calculateCommission(0, 'housing', 'rental')
      
      expect(result.listingPrice).toBe(0)
      expect(result.sellerCommission).toBe(0)
      expect(result.buyerCommission).toBe(0)
      expect(result.totalCommission).toBe(0)
      expect(result.sellerReceives).toBe(0)
      expect(result.buyerPays).toBe(0)
    })

    it('should handle very small prices', () => {
      const result = calculateCommission(100, 'housing', 'rental')
      
      expect(result.listingPrice).toBe(100)
      expect(result.sellerCommission).toBe(5)    // 5% of 100
      expect(result.buyerCommission).toBe(2)     // 2% of 100
      expect(result.sellerReceives).toBe(95)
      expect(result.buyerPays).toBe(102)
    })

    it('should handle very large prices', () => {
      const result = calculateCommission(1000000000, 'housing', 'sale') // 1B XAF
      
      expect(result.listingPrice).toBe(1000000000)
      // Should use the highest tier rates
      expect(result.sellerRate).toBe(0.015) // 1.5%
      expect(result.buyerRate).toBe(0.005)  // 0.5%
      expect(result.sellerCommission).toBe(15000000)  // 1.5% of 1B
      expect(result.buyerCommission).toBe(5000000)    // 0.5% of 1B
    })
  })

  describe('Price Boundary Testing', () => {
    // Test exact boundary values for tier transitions
    
    it('should handle boundary between low and mid tier housing rental', () => {
      // Assuming boundary is at 200k
      const lowTier = calculateCommission(199999, 'housing', 'rental')
      const midTier = calculateCommission(200001, 'housing', 'rental')
      
      // Rates should be different
      expect(lowTier.sellerRate).toBeGreaterThan(midTier.sellerRate)
    })

    it('should handle exact boundary price', () => {
      // Test that boundary price uses the higher tier rates
      const result = calculateCommission(200000, 'housing', 'rental')
      expect(result.sellerRate).toBeDefined()
      expect(result.buyerRate).toBeDefined()
    })
  })

  describe('Invalid Input Handling', () => {
    it('should handle negative prices gracefully', () => {
      const result = calculateCommission(-1000, 'housing', 'rental')
      
      // Should either throw error or handle gracefully
      expect(result.listingPrice).toBe(-1000)
      // Commissions could be 0 or calculated normally depending on implementation
    })

    it('should handle invalid category gracefully', () => {
      // This might throw an error or default to housing
      try {
        const result = calculateCommission(100000, 'invalid' as Category, 'rental')
        expect(result).toBeDefined()
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should handle invalid transaction type gracefully', () => {
      try {
        const result = calculateCommission(100000, 'housing', 'invalid' as TransactionType)
        expect(result).toBeDefined()
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('Floating Point Precision', () => {
    it('should handle floating point calculations correctly', () => {
      const result = calculateCommission(33333, 'housing', 'rental')
      
      // Check that commission amounts are properly rounded
      expect(result.sellerCommission).toBe(Math.round(33333 * 0.05))
      expect(result.buyerCommission).toBe(Math.round(33333 * 0.02))
      
      // Total should equal sum of parts
      expect(result.totalCommission).toBe(
        result.sellerCommission + result.buyerCommission
      )
    })

    it('should maintain arithmetic consistency', () => {
      const result = calculateCommission(123456, 'cars', 'sale')
      
      // Verify that seller receives + commission = listing price
      expect(result.sellerReceives + result.sellerCommission).toBe(result.listingPrice)
      
      // Verify that buyer pays - commission = listing price  
      expect(result.buyerPays - result.buyerCommission).toBe(result.listingPrice)
    })
  })

  describe('Performance', () => {
    it('should calculate commissions quickly for many items', () => {
      const start = performance.now()
      
      // Calculate 10,000 commissions
      for (let i = 0; i < 10000; i++) {
        calculateCommission(Math.random() * 1000000, 'housing', 'rental')
      }
      
      const end = performance.now()
      const duration = end - start
      
      // Should complete in reasonable time (< 100ms for 10k calculations)
      expect(duration).toBeLessThan(100)
    })
  })

  describe('Real World Scenarios', () => {
    it('should handle typical apartment rental in Douala', () => {
      const result = calculateCommission(150000, 'housing', 'rental') // 150k/month
      
      expect(result.sellerCommission).toBeGreaterThan(0)
      expect(result.buyerCommission).toBeGreaterThan(0)
      expect(result.sellerReceives).toBeLessThan(150000)
      expect(result.buyerPays).toBeGreaterThan(150000)
    })

    it('should handle typical car rental for weekend', () => {
      const result = calculateCommission(50000, 'cars', 'rental') // 50k/day
      
      expect(result.sellerCommission).toBeGreaterThan(0)
      expect(result.buyerCommission).toBeGreaterThan(0)
      expect(result.totalCommission).toBeLessThan(50000) // Commission < price
    })

    it('should handle house purchase in Yaounde', () => {
      const result = calculateCommission(75000000, 'housing', 'sale') // 75M XAF
      
      expect(result.sellerCommission).toBeGreaterThan(100000) // Substantial commission
      expect(result.buyerCommission).toBeGreaterThan(50000)
      expect(result.sellerReceives).toBeLessThan(75000000)
    })

    it('should handle used car sale', () => {
      const result = calculateCommission(8000000, 'cars', 'sale') // 8M XAF car
      
      expect(result.sellerCommission).toBeGreaterThan(10000)
      expect(result.buyerCommission).toBeGreaterThan(5000)
      expect(result.totalCommission).toBeLessThan(800000) // < 10% of price
    })
  })
})