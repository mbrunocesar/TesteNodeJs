var vehicles = require('./vehicles');


app.get('/veiculos', vehicles.findAll);

app.get('/veiculos/find', vehicles.findByTerms);

app.get('/veiculos/:id', vehicles.findById);

app.post('/veiculos', vehicles.insert);

app.put('/veiculos/:id', vehicles.updateById);

app.patch('/veiculos/:id', vehicles.cleanUpdateById);

app.delete('/veiculos/limpar', vehicles.clear);

app.delete('/veiculos/:id', vehicles.delete);
