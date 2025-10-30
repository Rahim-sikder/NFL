import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ApplyLoanIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step of the loan application
    router.replace('/apply-loan/1');
  }, [router]);

  return null;
}