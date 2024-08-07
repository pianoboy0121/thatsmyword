(ns tmw.lobby
  (:require
   [re-frame.core :refer [dispatch subscribe]]
   [tmw.data :as data]))

(defn start_playing_btn_press []
  (dispatch [:start-playing @data/game_code]))

(defn lobby_container []
  [:div
   [:h3.ingame-code-text (str "Code: " @data/game_code)]
   [:p.players-list-label "Players:"]
   (let [player-names (map :name (vals @(subscribe [:players])))]
     [:ul.players-list {:style {:list-style-type "none" :padding "0" :margin "0"}}
      (for [player player-names]
        [:li player])])
   [:br]
   [:input.host_btn
    {:type "button" :value "Start Game"
     :on-click start_playing_btn_press
     :style {:width "100px"}
     :disabled (< @data/num_players 2)}]])