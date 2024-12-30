fn main(
    address: Field,
    payment: u32,
    balance: u32,
    index: Field,
    hash_path: [Field; 32],
    merkle_root: pub Field
) {
    let leaf = std::hash::pedersen_hash([address]);
    let computed_root = std::merkle::compute_merkle_root(leaf, index, hash_path);

    assert(computed_root == merkle_root);

    assert(balance >= payment);
}