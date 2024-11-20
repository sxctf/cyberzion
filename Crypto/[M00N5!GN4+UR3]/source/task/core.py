from hashlib import sha256
from random import randrange

p = 261763366998505420117922937202077498689
q = 1249013414826667461054563
g = 234571634339194295184736054687977117090
y = 24156591143763722808648225122966924457
w = 237318180652004142928994

def fast_powered(num, deg, mod):
    num %= mod
    deg %= (mod - 1)
    res = 1

    while deg != 0:
        if (deg & 1) != 0:
            res *= num
            res %= mod

        deg //= 2
        num *= num
        num %= mod

    return res

def revert_number(num, mod):
    return fast_powered(num, mod - 2, mod)

def sign(M):
    m1, m2 = M
    r = randrange(256)
    x = fast_powered(g, r, p) % p

    msg = str(m1) + str(m2) + str(x)
    s1 = sha256(msg.encode('utf-8')).hexdigest()

    s2 = (r + w * int(s1, 16)) % q

    return (s1, str(hex(s2)))

def verify(s1, s2, M):
    m1, m2 = M

    t1 = fast_powered(g, int(s2, 16), p)
    t2 = fast_powered(y, int(s1, 16), p)
    t = (t1 * t2) % p

    msg = str(m1) + str(m2) + str(t)

    return sha256(msg.encode('utf-8')).hexdigest() == s1
