import { redis } from './cacheConfig';

export async function testRedisConnection(): Promise<void> {
  console.log('🔍 Testing Redis connection...');
  
  try {
    // Test WRITE operation
    console.log('📝 Testing WRITE operation...');
    const testKey = 'test:connection';
    const testValue = { timestamp: new Date().toISOString(), message: 'Connection test successful' };
    await redis.set(testKey, JSON.stringify(testValue), { ex: 60 });
    console.log('✅ WRITE successful:', testValue);

    // Test READ operation
    console.log('📖 Testing READ operation...');
    const retrievedValue = await redis.get(testKey);
    console.log('✅ READ successful:', retrievedValue);

    // Verify data integrity
    if (retrievedValue === JSON.stringify(testValue)) {
      console.log('✅ Data integrity verified');
    } else {
      console.warn('⚠️  Data mismatch detected');
    }

    // Test DELETE operation
    console.log('🗑️  Testing DELETE operation...');
    const deleteResult = await redis.del(testKey);
    console.log('✅ DELETE successful, deleted count:', deleteResult);

    // Verify deletion
    console.log('🔍 Verifying deletion...');
    const verifyDeletion = await redis.get(testKey);
    if (verifyDeletion === null) {
      console.log('✅ Deletion verified - key no longer exists');
    } else {
      console.warn('⚠️  Key still exists after deletion');
    }

    console.log('🎉 All Redis operations completed successfully!\n');
  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    throw error;
  }
}
