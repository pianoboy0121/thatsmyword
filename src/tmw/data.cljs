(ns tmw.data
  (:require
   [reagent.core :as r]))

(def join_name (r/atom ""))

(def host_name (r/atom ""))

(def current_code_text (r/atom ""))

(def game_code (r/atom ""))

(def num_players (r/atom 0))

(def active_games (r/atom {}))

(def prompts (r/atom []))