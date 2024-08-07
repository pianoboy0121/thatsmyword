(ns tmw.data
  (:require
   [clojure.string :as s]
   [reagent.core :as r]
   [re-frame.core :refer [dispatch]]))

(def join_name (r/atom ""))

(def host_name (r/atom ""))

(def current_code_text (r/atom ""))

(def game_code (r/atom ""))

(def num_players (r/atom 0))

(def active_games (r/atom {}))