import React, { useState } from 'react';
import { Settings, X, Plus, Trash2, RotateCcw, Users, Layers, Tv, AlertTriangle, Check, BookOpen } from 'lucide-react';
import { Ingredient, INITIAL_INGREDIENTS } from '../data/ingredients';
import { CookingMethod, COOKING_METHODS } from '../data/cookingMethods';
import { Mission, INITIAL_MISSIONS } from '../data/missions';
import { TeamRecipe } from '../types';

interface TeacherAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  cookingMethods: CookingMethod[];
  missions: Mission[];
  savedTeams: TeamRecipe[];
  onUpdateIngredients: (items: Ingredient[]) => void;
  onUpdateMethods: (items: CookingMethod[]) => void;
  onUpdateMissions: (items: Mission[]) => void;
  onDeleteTeam: (teamId: string) => void;
  onResetAllData: () => void;
  onOpenClassroomBoard: () => void;
}

export const TeacherAdminModal: React.FC<TeacherAdminModalProps> = ({
  isOpen,
  onClose,
  ingredients,
  cookingMethods,
  missions,
  savedTeams,
  onUpdateIngredients,
  onUpdateMethods,
  onUpdateMissions,
  onDeleteTeam,
  onResetAllData,
  onOpenClassroomBoard,
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'cards' | 'reset'>('teams');

  // New Ingredient form
  const [newIngName, setNewIngName] = useState('');
  const [newIngEmoji, setNewIngEmoji] = useState('🥗');
  const [newIngProcessed, setNewIngProcessed] = useState(false);

  // New Mission form
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionDesc, setNewMissionDesc] = useState('');

  // Confirm reset state
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  // Add new ingredient
  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngName.trim()) return;

    const newIng: Ingredient = {
      id: `custom-ing-${Date.now()}`,
      name: newIngName.trim(),
      emoji: newIngEmoji || '🥗',
      category: '곡류·기타',
      isProcessed: newIngProcessed,
      description: '교사가 추가한 교실 실습 식재료',
    };

    onUpdateIngredients([...ingredients, newIng]);
    setNewIngName('');
  };

  // Add new mission
  const handleAddMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionTitle.trim()) return;

    const newMis: Mission = {
      id: `custom-mis-${Date.now()}`,
      title: newMissionTitle.trim(),
      description: newMissionDesc.trim() || '교사 지정 창의 조리 미션',
      icon: '🎯',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      evaluationFocus: '수업 목표 달성도',
    };

    onUpdateMissions([...missions, newMis]);
    setNewMissionTitle('');
    setNewMissionDesc('');
  };

  // Reset cards to textbook defaults
  const handleResetCardsToDefault = () => {
    onUpdateIngredients(INITIAL_INGREDIENTS);
    onUpdateMethods(COOKING_METHODS);
    onUpdateMissions(INITIAL_MISSIONS);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-2 border-stone-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900">
                교사용 관리 센터 (Teacher Control Center)
              </h2>
              <p className="text-xs text-stone-500">
                모둠 레시피 제출 현황 관리 및 카드 데이터셋 편집
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'teams'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>제출 모둠 관리 ({savedTeams.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>카드 데이터셋 편집</span>
            </button>

            <button
              onClick={() => setActiveTab('reset')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reset'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>수업 전체 초기화</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenClassroomBoard();
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>전자칠판 모드 열기</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'teams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-stone-900">
                  등록된 모둠 및 제출 레시피 목록
                </h3>
                <span className="text-xs text-stone-500">
                  교사는 학생들의 오기입 항목을 삭제하거나 관리할 수 있습니다.
                </span>
              </div>

              {savedTeams.length === 0 ? (
                <div className="text-center py-12 text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl">
                  아직 등록된 모둠 결과가 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                  {savedTeams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-800 shrink-0">
                          {team.aiImageUrl ? (
                            <img
                              src={team.aiImageUrl}
                              alt={team.menuName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">
                              사진
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-800">
                              {team.teamName}
                            </span>
                            <span className="text-xs text-stone-500">
                              {team.drawnMethod?.name} • {team.cookingTimeMinutes}분
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                            {team.menuName}
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            주재료: {team.mainIngredients} | 미션: {team.drawnMission?.title}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTeam(team.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="모둠 레시피 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-stone-900">
                    수업 카드 데이터셋 추가 및 편집
                  </h3>
                  <p className="text-xs text-stone-500">
                    교과 실습 환경에 맞춰 새로운 식재료나 미션을 추가할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={handleResetCardsToDefault}
                  className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                >
                  기본 교과서 카드로 초기화
                </button>
              </div>

              {/* Add Ingredient Section */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <span className="text-xs font-black text-amber-900 block">
                  + 새 재료 카드 추가
                </span>
                <form onSubmit={handleAddIngredient} className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    value={newIngEmoji}
                    onChange={(e) => setNewIngEmoji(e.target.value)}
                    placeholder="이모지"
                    className="w-16 px-2.5 py-1.5 rounded-lg border border-stone-300 text-center text-sm bg-white"
                  />
                  <input
                    type="text"
                    value={newIngName}
                    onChange={(e) => setNewIngName(e.target.value)}
                    placeholder="재료명 (예: 방울토마토, 베이컨)"
                    className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg border border-stone-300 text-xs sm:text-sm bg-white"
                  />
                  <label className="flex items-center gap-1 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newIngProcessed}
                      onChange={(e) => setNewIngProcessed(e.target.checked)}
                      className="rounded"
                    />
                    <span>가공식품 여부</span>
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    추가
                  </button>
                </form>

                {/* Current Ingredients Chips */}
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-2 border-t border-amber-200">
                  {ingredients.map((ing) => (
                    <span
                      key={ing.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-800"
                    >
                      <span>{ing.emoji}</span>
                      <span className="font-semibold">{ing.name}</span>
                      {ing.isProcessed && <span className="text-[10px] text-rose-500 font-bold">🧪</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add Mission Section */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <span className="text-xs font-black text-emerald-900 block">
                  + 새 요리 미션 추가
                </span>
                <form onSubmit={handleAddMission} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMissionTitle}
                      onChange={(e) => setNewMissionTitle(e.target.value)}
                      placeholder="미션 제목 (예: 소풍 도시락용 요리)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs sm:text-sm bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      추가
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newMissionDesc}
                    onChange={(e) => setNewMissionDesc(e.target.value)}
                    placeholder="미션 설명 (예: 휴대하기 편하고 식어도 맛있는 레시피)"
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                </form>

                {/* Current Missions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pt-2 border-t border-emerald-200">
                  {missions.map((mis) => (
                    <div
                      key={mis.id}
                      className="p-2 rounded-lg bg-white border border-stone-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-stone-900">{mis.icon} {mis.title}</span>
                        <p className="text-[10px] text-stone-500 line-clamp-1">{mis.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="max-w-md mx-auto text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                수업 전체 데이터 초기화
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                현재 브라우저에 저장된 모든 모둠의 레시피, 뽑은 카드, AI 이미지, 검증 결과가 영구 삭제됩니다. 다음 교시 수업을 준비할 때 사용하세요.
              </p>

              {!showConfirmReset ? (
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(true)}
                  className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition-colors cursor-pointer shadow-md shadow-rose-600/20"
                >
                  수업 데이터 전체 초기화하기
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3">
                  <p className="text-xs font-black text-rose-900">
                    ⚠️ 정말로 모든 모둠의 데이터를 삭제하시겠습니까?
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmReset(false)}
                      className="px-4 py-2 rounded-xl bg-stone-200 text-stone-800 text-xs font-bold hover:bg-stone-300 cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfirmReset(false);
                        onResetAllData();
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 cursor-pointer"
                    >
                      확인, 모두 삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
