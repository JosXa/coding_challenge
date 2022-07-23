/*
Stichworte:
- Statische Typisierung. Fehler vermeiden, indem man Typen in JavaScript type annotations bzw. TypeScript angibt.
- Separation of concerns. Die Teile, welche Berechnungen vornehmen (domain logic), strikt von der Formatierung der Ausgabe (presentation layer) trennen.
- Encapsulation. Logik, die zusammengehört, ist in aufgabenspezifische Funktionen ausgelagern
- Avoid muatability. Mutable state immer vermeiden, wenn möglich. Funktionalen Ansatz wählen um Zustand des Systems zu kapseln
*/


/**
 *
 * @param {
 *     {
 *         customer: string,
 *         performances: {
 *             playID: string,
 *             audience: number
 *         }[]
 *     }
 * } invoice
 * @param {
 *     {
 *         [key: string]: {
 *               name: string,
 *               type: string
 *         }
 *     }
 * } plays
 * @returns {string}
 */
function createStatement(invoice, plays) {
    const summary = invoice.performances.reduce(
        (current, perf) => {
            const audience = perf.audience;
            const play = plays[perf.playID];
            const playType = play.type;

            const item = calculateOrderItem(playType, audience);

            return {
                total: current.total + item,
                volumeCredits:
                    current.volumeCredits +
                    calculateVolumeCredits(playType, audience),
                orders: {
                    ...current.orders,
                    [play.name]: { item, audience },
                },
            };
        },
        { total: 0, volumeCredits: 0, orders: {} }
    );

    const parts = [`Statement for ${invoice.customer}`];

    Object.entries(summary.orders).forEach(([key, value]) =>
        parts.push(
            `    ${key}: ${formatCurrency(value.item / 100)} (${
                value.audience
            } seats)`
        )
    );

    parts.push(`  Amount owed is ${formatCurrency(summary.total / 100)}`);
    parts.push(`  You earned ${summary.volumeCredits} credits`);
    return parts.join("\n");
}

/**
 * @param {string} playType
 * @param {number} audience
 * @returns {number}
 */
const calculateOrderItem = (playType, audience) => {
    switch (playType) {
        case "tragedy":
            return 40000 + (audience > 30 ? 1000 * (audience - 30) : 0);
        case "comedy":
            return (
                30000 +
                300 * audience +
                (audience > 20 ? 10000 + 500 * (audience - 20) : 0)
            );
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
};

/**
 * @param {string} playType
 * @param {number} audience
 * @returns {number}
 */
const calculateVolumeCredits = (playType, audience) => {
    let result = Math.max(audience - 30, 0);

    // add extra credit for every ten comedy attendees
    if (playType === "comedy") {
        result += Math.floor(audience / 5);
    }

    return result;
};

/**
 * @param {number} value
 * @returns {string}
 */
const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value);

module.exports = {
    createStatement,
};
