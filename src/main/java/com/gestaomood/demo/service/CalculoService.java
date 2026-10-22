
package com.gestaomood.demo.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CalculoService {

    public BigDecimal calcular(BigDecimal valorCompra, BigDecimal desconto) {
        if (valorCompra == null || desconto == null ||
                valorCompra.compareTo(BigDecimal.ZERO) < 0 ||
                desconto.compareTo(BigDecimal.ZERO) < 0 ||
                desconto.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Informe valores válidos.");
        }

        BigDecimal valorDesconto = valorCompra.multiply(desconto)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        return valorCompra.subtract(valorDesconto)
                .setScale(2, RoundingMode.HALF_UP);
    }
}
