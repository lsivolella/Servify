CREATE TABLE IF NOT EXISTS comissao (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    valor NUMERIC(3,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_comissao_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id),
    CONSTRAINT chk_comissao_valor
        CHECK (valor >= 0.00 AND valor <= 1.00)
);