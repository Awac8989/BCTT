with open('src/routes/ho-so/$id.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('  CreditCard,\n}', '  CreditCard,\n  MapPin,\n}').replace('  CreditCard,\r\n}', '  CreditCard,\r\n  MapPin,\r\n}')
with open('src/routes/ho-so/$id.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/routes/chi-tra.tsx', 'r', encoding='utf-8') as f:
    c2 = f.read()

c2 = c2.replace('const { chiTraList } = useAppState();', 'const { chiTraList, hoSoList } = useAppState();')
with open('src/routes/chi-tra.tsx', 'w', encoding='utf-8') as f:
    f.write(c2)

print('FIXED BOTH!')

