import { CreditCard, AlertTriangle } from 'lucide-react'

export function BookingForm({
  members,
  selectedSlot,
  contactName,
  memberId,
  isBlacklistedMember,
  blacklistReason,
  onContactName,
  onMemberId,
  onSubmit,
}) {
  const member = members.find((item) => item.id === Number(memberId))
  const amount = selectedSlot && member ? (selectedSlot.price * member.discount_rate).toFixed(2) : '0.00'
  const submitDisabled = !selectedSlot || !contactName.trim() || isBlacklistedMember

  const normalMembers = members.filter((item) => !item.is_blacklisted)
  const blacklistedMembers = members.filter((item) => item.is_blacklisted)

  return (
    <section className="panel booking-panel">
      <div className="section-title">
        <CreditCard size={18} />
        <h2>在线预约与费用结算</h2>
      </div>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          预约人
          <input
            value={contactName}
            onChange={(event) => onContactName(event.target.value)}
            placeholder="输入姓名"
          />
        </label>
        <label>
          会员折扣
          <select
            value={memberId}
            onChange={(event) => onMemberId(event.target.value)}
            className={isBlacklistedMember ? 'select-blacklisted' : ''}
          >
            <optgroup label="可预约会员">
              {normalMembers.map((item) => (
                <option key={item.id} value={item.id}>
                  ✅ {item.name} · {item.level} · {(item.discount_rate * 10).toFixed(1)}折
                </option>
              ))}
            </optgroup>
            {blacklistedMembers.length > 0 && (
              <optgroup label="🚫 已限制（无法预约）">
                {blacklistedMembers.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="option-blacklisted"
                    style={{ backgroundColor: '#fef2f2', color: '#991b1b', fontWeight: 700 }}
                  >
                    🚫 {item.name} · {item.level} · 已列入黑名单
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
        {isBlacklistedMember && (
          <div className="blacklist-warning">
            <div className="blacklist-warning-header">
              <AlertTriangle size={18} className="blacklist-icon" />
              <strong>该会员已被限制预约</strong>
            </div>
            <p className="blacklist-reason">
              <span>限制原因：</span>
              {blacklistReason || '该用户已被列入黑名单，暂无法预约'}
            </p>
          </div>
        )}
        <div className="settlement-box">
          <span>当前时段</span>
          <strong>{selectedSlot ? selectedSlot.label : '请选择可预约时段'}</strong>
          <span>应付金额</span>
          <strong>¥{amount}</strong>
        </div>
        <button
          className={`primary-action ${isBlacklistedMember ? 'action-blocked' : ''}`}
          type="submit"
          disabled={submitDisabled}
          title={isBlacklistedMember ? '黑名单用户无法提交预约' : ''}
        >
          {isBlacklistedMember ? '已限制 · 无法预约' : '提交预约'}
        </button>
      </form>
    </section>
  )
}
