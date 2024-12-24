fn main(balance: u64, payment: u64, limit: u64, fee_rate: u64) {
    let fee: u64 = (payment * fee_rate) / 100;
    let total_payment: u64 = payment + fee;
    assert(balance >= total_payment);
    assert(total_payment <= limit);
}
