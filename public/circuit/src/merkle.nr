use dep::std::hash::poseidon2::Poseidon2;

fn hash_pair(left: Field, right: Field) -> Field {
    Poseidon2::hash([left, right], 2)
}

fn main(leaf: Field, path: [Field; 2], selector: [bool; 2], root: pub Field) {
    let mut digest = leaf;

    for i in 0..2 {
        let (left, right) = if selector[i] {
            (path[i], digest)
        } else {
            (digest, path[i])

        };
        digest = hash_pair(left, right);
    }
    assert(digest == root, "Merkle inclusion failed");
}

#[test]
fn should_verify_merkle_inclusion() {
    let leaf = 0x0b6423c65de8971f0643ab09e384b6009ccf91afc59eb82b3f762d3b068f3be6;
    let path: [Field; 2] = [
        0x2c89cbf002f98b27bed8c22279d920ec121130909ccb798b59e775f567f2eef6,
        0x232cffccaefe9c394f4aada19e5b0599b85de274e62074a686431b608c468c94,
    ];
    let selector: [bool; 2] = [true, true];
    let root = 0x0a75936c9198aa238464d75b9f441788683d16a315c428c60160c24566d010a9;

    main(leaf, path, selector, root);
}
