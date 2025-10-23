<img width="1129" height="353" alt="image" src="https://github.com/user-attachments/assets/de541065-562b-4cd2-b428-fa41acb29b76" /># AlgoTrader India: AI-Powered Options Trading Simulator

AlgoTrader India is a sophisticated paper trading platform for the Indian derivatives market. It uses the Google Gemini API to suggest, simulate, and analyze trading strategies for Nifty and Bank Nifty options, providing a realistic and insightful virtual trading experience.

---

## 🚀 Live Demo

**[Add your public Google AI Studio preview link here]**

*Instructions: To share a live demo, deploy this project in Google AI Studio and replace the line above with your public preview URL.*

*(Note: Live demos are for demonstration purposes. All data is simulated.)*

---

## 📸 Screenshots

**[Add screenshots of your application here]**

*Instructions: To add screenshots:*
1.  *Create a folder in your repository (e.g., `screenshots` or `assets`).*
2.  *Add your images (e.g., `dashboard.png`, `simulator.png`).*
3.  *Embed them in this README using Markdown syntax, like this:*
    ```markdown
  <img width="1873" height="970" alt="image" src="https://github.com/user-attachments/assets/85fd4c94-ad7e-4b72-a66e-28526f5f965e" />
<img width="1850" height="825" alt="image" src="https://github.com/user-attachments/assets/812ab641-c8d7-4d42-ba0c-2ba25acd698a" />

    ```

---


## ✨ Key Features

### 1. Live Market Dashboard
- **Real-time Status**: View the current status of the National Stock Exchange (NSE), indicating whether the market is OPEN or CLOSED.
- **Live Price Tickers**: Track simulated live prices for the **NIFTY 50** and **BANK NIFTY** indices.
- **Dynamic Updates**: Prices, day's change, and percentage change are updated every few seconds during simulated market hours (9:15 AM - 3:30 PM IST, weekdays) to mimic a live trading environment.

### 2. AI-Powered Analysis & Strategy Generation
Our platform integrates the Google Gemini API to provide intelligent trading insights:

- **🤖 AI Strategy Suggester**: Analyzes current market sentiment and suggests the most suitable options strategy (e.g., *Long Straddle, Iron Condor*). Provides a detailed rationale, key parameters (market view, suggested strikes, stop-loss), and potential risks.
- **🔍 AI Strategy Finder**: Users can input their specific risk-reward profile by defining a **Target Profit** and **Max Acceptable Loss**. The AI then scans the market to find up to three strategies that fit these precise criteria.
- **📈 AI Top 5 Picks**: Delivers a curated list of the top 5 most promising intraday option trade ideas. Each pick includes the specific instrument, action (Buy/Sell), estimated entry price, capital required, and potential profit/loss.

### 3. Advanced Strategy Simulation
- **Intraday Backtesting**: Select any AI-suggested or found strategy to run an instant simulation against today's market conditions.
- **Performance Visualization**:
    - **Today's P/L**: An interactive line chart visualizes the hypothetical intraday profit and loss fluctuation.
    - **7-Day Historical Performance**: A beautifully designed bar chart shows the strategy's simulated performance over the last 7 market working days, helping you understand its consistency.
- **Detailed Analytics**: The simulation provides crucial metrics, including the final P/L amount (₹) and percentage (%), estimated capital required, and maximum potential loss.
- **AI Commentary**: Get a brief, AI-generated analysis explaining the "why" behind the simulated performance.

### 4. Interactive Paper Trading Portfolio
- **Build Your Portfolio**: Add any AI-suggested strategy or top pick to your virtual portfolio with a single click.
- **Live P/L Tracking**: All open positions are tracked in real-time, with unrealized P/L updating dynamically based on simulated market movements.
- **Comprehensive Summary**: The portfolio dashboard provides a clear overview of your total capital deployed, realized P/L, unrealized P/L, and total P/L.
- **Position Management**: Easily manage your risk by exiting individual positions, closing all "picks" or "strategies" at once, or exiting all positions entirely.

---

## 🛠️ Technology Stack

-   **Frontend**: React with TypeScript
-   **Styling**: Tailwind CSS for a modern, responsive UI
-   **AI & Backend Logic**: Google Gemini API (`@google/genai`)
-   **Charting**: Recharts for interactive and beautiful data visualizations

---

## ⚠️ Disclaimer

AlgoTrader India is a **simulation tool** created for educational and demonstrational purposes only. All market data is simulated, and all trades are virtual (paper trades). The information and strategies provided by the AI are hypothetical and **do not constitute financial advice**. Trading in derivatives involves substantial risk, and you should consult with a qualified financial advisor before making any real investment decisions.
